# DJANGO IMPORTS
from datetime import datetime
from typing import List

from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

# DJANGO-NINJA IMPORTS
from ninja import NinjaAPI, Schema, ModelSchema
from ninja.pagination import paginate
from ninja.security import HttpBearer

# MODEL IMPORTS

from .models import Book, Category, Cart, Comment, Author, Sale, Wishlist, UserExtraData
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from sqlite3 import IntegrityError

api = NinjaAPI(csrf=False)


def validate_token(token_header):
    if token_header:
        if token_header.startswith('Bearer '):
            auth_token = token_header[7:]
            return auth_token
        else:
            return 403, "UnAuthorized"
    else:
        return 403, "UnAuthorized"


def retrieve_token(username):
    user = get_object_or_404(User, username=username)
    token = Token.objects.filter(user=user).first()
    if token is None:
        try:
            token = Token.objects.create(user=user)
        except token.DoesNotExist:
            return 503, "Service Unavailable. Please retry later."

    return token.key


def retrieve_user(token_header):
    auth_token = validate_token(token_header)
    token_query = get_object_or_404(Token, key=auth_token)
    user_query = get_object_or_404(User, username=token_query.user)
    return user_query


def retrieve_author(token_header):
    user_query = retrieve_user(token_header)
    author_query = get_object_or_404(Author, user=user_query.id)
    return author_query


def is_user_an_author(user):
    User_extra_data = get_object_or_404(UserExtraData, user=user)
    is_author = User_extra_data.is_author
    return is_author


class AuthBearer(HttpBearer):
    def authenticate(self, request, key):
        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization')
            auth_token = validate_token(token)
            try:
                user_token = get_object_or_404(Token, key=auth_token)
                user = get_object_or_404(User, username=user_token.user)
            except Token.DoesNotExist:
                return 403, "UnAuthorized"
            try:
                user_token = get_object_or_404(Token, user=user)
            except Token.DoesNotExist:
                return 403, "UnAuthorized"
            if key == user_token.key:
                return key
        else:
            return 403, "UnAuthorized"


# api endpoints

class ChangePassword(Schema):
    username: str
    new_password: str


class UserRegister(Schema):
    username: str
    email: str
    password: str
    is_author: bool


class ModifyUser(Schema):
    username: str
    email: str


class LogIn(ModelSchema):
    class Config:
        model = User
        model_fields = ['username', 'password']


class BookIn(Schema):
    id: int
    title: str
    language: str
    synopsis: str
    series: str
    volumeNumber: int
    target_audience: str
    mature_content: bool
    price: str
    book_cover: str


class BookOut(Schema):
    author: str
    title: str
    language: str
    synopsis: str
    category: str
    series: str
    volumeNumber: int
    target_audience: str
    mature_content: bool
    price: str
    book_cover: str
    rating: int


class LanguageOption(Schema):
    languageCode: str
    languageLabel: str


class CartIn(ModelSchema):
    class Config:
        model = Cart
        model_fields = ['book']


class SalesIn(ModelSchema):
    class Config:
        model = Sale
        model_fields = ['book']


class CartOut(Schema):
    id: int
    title: str
    author: str
    language: str
    book_cover: str
    price: str


class WishListIn(ModelSchema):
    class Config:
        model = Wishlist
        model_fields = ['book']


class WishListOut(Schema):
    title: str
    author: str
    language: str
    book_cover: str


class SaleIn(ModelSchema):
    class Config:
        model = Sale
        model_fields = ["book"]


class SalesOut(Schema):
    title: str
    author: str
    language: str
    book_cover: str
    book_file: str
    date: str


class LoginOut(Schema):
    token: str
    is_author: bool


class CategorySchema(ModelSchema):
    class Config:
        model = Category
        model_fields = ["category"]


class AuthorIn(ModelSchema):
    class Config:
        model = Author
        model_fields = ['alias', 'about_you', 'image']


class AuthorOut(Schema):
    username: str
    alias: str
    about_you: str
    books: list


class AuthorOutNeed(Schema):
    alias: str


class CommentIn(Schema):
    title: str
    comment: str
    rating: int
    book: str


class CommentOut(Schema):
    title: str
    comment: str
    rating: str
    user: str


class GetBookComment(Schema):
    book: str


@csrf_exempt
@api.post("/sign-up-user", auth=None)
def signup_user(request, user_petition: UserRegister):
    user = {'username': user_petition.username, 'email': user_petition.email,
            'password': user_petition.password}
    try:
        User.objects.create_user(**user)
    except IntegrityError:
        return HttpResponse('Username already exists.')
    author_user = get_object_or_404(User, username=user_petition.username)
    UserExtraData.objects.create(user=author_user, is_author=user_petition.is_author, avatar=None)

    return {"status": 200, "message": "User has been successfully created"}


@csrf_exempt
@api.api_operation(["POST", "GET"], "/login", auth=None, response=LoginOut)
def login(request, use: LogIn):
    username = use.username
    password = use.password
    user_auth = authenticate(username=username, password=password)
    is_author = is_user_an_author(user_auth)
    if user_auth is not None:
        token_key = retrieve_token(use.username)
        login_data = {
            'token': token_key,
            'is_author': is_author
        }
        return login_data
    else:
        return {"status": 400, "detail": "Wrong Password or username"}


@csrf_exempt
@api.post("/create-author", auth=AuthBearer())
def create_author_data(request, author: AuthorIn):
    try:
        token = request.headers.get('Authorization')
        auth_token = validate_token(token)
        token_table = get_object_or_404(Token, key=auth_token)
        user_query = get_object_or_404(User, username=token_table.user)
        dictionary = {"user_id": user_query.id, "alias": author.alias, "about_you": author.about_you,
                      "image": author.image}
        Author.objects.create(**dictionary)
        return {"status": 200, "message": "Author profile has been successfully created"}
    except AttributeError:
        return {"status": 403, "message": "UnAuthorized"}


@csrf_exempt
@api.post("/create-book", auth=AuthBearer())
def create_book(request, created_book: BookIn):
    token = request.headers.get('Authorization')
    user = retrieve_user(token)
    is_author = is_user_an_author(user)
    if is_author:
        author_query = retrieve_author(token)
        book = Book(
            author=author_query,
            title=created_book.title,
            language=created_book.language,
            synopsis=created_book.synopsis,
            series=created_book.series,
            volumeNumber=created_book.volumeNumber,
            target_audience=created_book.target_audience,
            mature_content=created_book.mature_content,
            price=created_book.price,
            book_cover=created_book.book_cover,
        )
        book.save()
        return {"status": 200, "message": "Book created successfully"}
    else:
        return 403, "UnAuthorized"


@csrf_exempt
@api.post("/add-book-cart", auth=AuthBearer())
def add_book_cart(request, payload: CartIn):
    token = request.headers.get('Authorization')
    user = retrieve_user(token)
    book = get_object_or_404(Book, id=payload.book)
    book_cart = Cart(
        user_id=user.id,
        book_id=book.id,
    )
    book_cart.save()
    return {"status": 200, "message": "Book added to the Cart"}


@csrf_exempt
@api.post("/add-book-wishlist", auth=AuthBearer())
def add_book_wishlist(request, payload: WishListIn):
    token = request.headers.get('Authorization')
    user = retrieve_user(token)
    is_author = is_user_an_author(user)
    if is_author:
        return 403, "UnAuthorized"
    else:
        book = get_object_or_404(Book, id=payload.book)
        book_wishlist = Wishlist(
            user_id=user.id,
            book_id=book.id,
        )
        book_wishlist.save()
        return {"status": 200, "message": "Book added to the Wishlist"}


@csrf_exempt
@api.post("/book-bought", auth=AuthBearer())
def sale(request, payload: SalesIn):
    token = request.headers.get('Authorization')
    user = retrieve_user(token)
    book = get_object_or_404(Book, id=payload.book)
    book.sales = book.sales + 1
    book.save()
    book_sale = Sale(
        date=datetime.now(),
        user=user,
        book=book,
    )
    book_sale.save()
    return {"status": 200, "message": "Book bought successfully"}


@csrf_exempt
@api.post("/create-comment", auth=AuthBearer())
def create_comment(request, payload: CommentIn):
    token_header = request.headers.get('Authorization')
    user = retrieve_user(token_header)
    is_author = is_user_an_author(user)
    if is_author:
        return 403, "UnAuthorized"
    else:
        book = get_object_or_404(Book, title=payload.book)
        comment = Comment(
            title=payload.title,
            comment=payload.comment,
            rating=payload.rating,
            user=user,
            book=book,
        )
        comment.save()
        return {"status": 200, "message": "Comment created successfully"}


@csrf_exempt
@api.api_operation(["POST", "GET"], "/author-profile", auth=None, response=AuthorOut)
def author_profile(request, payload: AuthorOutNeed):
    author = get_object_or_404(Author, alias=payload.alias)
    user = get_object_or_404(User, username=author.user.username)
    if is_user_an_author(user):
        books = Book.objects.filter(author=author)
        Booklist = []
        for book in books:
            book_info = {
                'id': book.id,
                'title': book.title,
                'author': str(author.alias),
                'language': book.language,
                'synopsis': book.synopsis,
                'category': str(book.category),
                'series': book.series,
                'volumeNumber': book.volumeNumber,
                'target_audience': book.target_audience,
                'mature_content': book.mature_content,
                'price': book.price,
                'book_cover': str(book.book_cover),
                'rating': book.rating
            }
            Booklist.append(book_info)
        author_data = {
            'username': user.username,
            'alias': author.alias,
            'about_you': author.about_you,
            'books': Booklist
        }
        return author_data
    else:
        return "User is not an author"


@csrf_exempt
@api.get("/book/{book_id}", response=BookOut)
def specific_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    author = get_object_or_404(Author, id=book.author_id)
    book_info = {
        'id': book.id,
        'title': book.title,
        'author': str(author.alias),
        'language': book.language,
        'synopsis': book.synopsis,
        'category': str(book.category),
        'series': book.series,
        'volumeNumber': book.volumeNumber,
        'target_audience': book.target_audience,
        'mature_content': book.mature_content,
        'price': book.price,
        'book_cover': str(book.book_cover),
        'rating': book.rating
    }
    return book_info


@csrf_exempt
@api.api_operation(["POST", "GET"], "/comments", auth=None, response=List[CommentOut])
def get_comments(request, payload: GetBookComment):
    book = get_object_or_404(Book, title=payload.book)
    comments = Comment.objects.filter(book=book.id)
    if comments is None:
        return 404, "Object does not exist"
    SchemaOut = []
    for comment in comments:
        comment_info = {
            'title': comment.title,
            'comment': comment.comment,
            'rating': comment.rating,
            'user': str(comment.user)
        }
        SchemaOut.append(comment_info)
    return SchemaOut


@csrf_exempt
@api.get("/library", response=List[BookOut])
@paginate
def library(request):
    books = Book.objects.all()
    SchemaOut = []
    for book in books:
        author = get_object_or_404(Author, id=book.author_id)
        book_info = {
            'id': book.id,
            'title': book.title,
            'author': str(author.alias),
            'language': book.language,
            'synopsis': book.synopsis,
            'category': str(book.category),
            'series': book.series,
            'volumeNumber': book.volumeNumber,
            'target_audience': book.target_audience,
            'mature_content': book.mature_content,
            'price': book.price,
            'book_cover': str(book.book_cover),
            'rating': book.rating
        }
        SchemaOut.append(book_info)
    return list(SchemaOut)


@csrf_exempt
@api.get("/wish-list", response=List[WishListOut], auth=AuthBearer())
def wish_list(request):
    token = request.headers.get('Authorization')
    user = retrieve_user(token)
    try:
        wishlist_books = Wishlist.objects.filter(user_id=user.id)
    except wishlist_books.DoesNotExist:
        return 404, "Object does not exist"
    SchemaOut = []
    for wishlist_book in wishlist_books:
        books = Book.objects.get(id=wishlist_book.book_id)
        author = Author.objects.get(id=books.author.id)
        book_info = {
            'title': books.title,
            'author': author.alias,
            'language': books.language,
            'book_cover': str(books.book_cover),
            'price': books.price
        }
        SchemaOut.append(book_info)
    return SchemaOut


@csrf_exempt
@api.get("/cart", response=List[CartOut], auth=AuthBearer())
def cart(request):
    token = request.headers.get('Authorization')
    user = retrieve_user(token)
    try:
        cart_books = Cart.objects.filter(user_id=user.id)
    except cart_books.DoesNotExist:
        return 404, "Object does not exist"
    SchemaOut = []
    for cart_book in cart_books:
        books = Book.objects.get(id=cart_book.book_id)
        author = Author.objects.get(id=books.author.id)
        book_info = {
            'id': books.id,
            'title': books.title,
            'author': author.alias,
            'language': books.language,
            'book_cover': str(books.book_cover),
            'price': books.price
        }
        SchemaOut.append(book_info)
    return SchemaOut


@csrf_exempt
@api.get("/my-books", response=List[SalesOut], auth=AuthBearer())
def my_books(request):
    token = request.headers.get('Authorization')
    user = retrieve_user(token)
    try:
        user_books = Sale.objects.filter(user_id=user.id)
    except user_books.DoesNotExist:
        return 404, "Object does not exist"
    SchemaOut = []
    for user_book in user_books:
        books = Book.objects.get(id=user_book.book_id)
        author = Author.objects.get(id=books.author_id)
        book_info = {
            'title': books.title,
            'author': author.alias,
            'language': books.language,
            'book_cover': str(books.book_cover),
            'book_file': str(books.book_file),
            'date': str(user_book.date),
        }
        SchemaOut.append(book_info)
    return SchemaOut


@csrf_exempt
@api.get("/language-options")
def language_options(request) -> list[LanguageOption]:
    return [LanguageOption(languageCode=choice[0], languageLabel=choice[1]) for choice in Book.Language.choices]


@api.get("/categories", response=List[CategorySchema])
def categories(request):
    queryset = Category.objects.all()
    return list(queryset)


@csrf_exempt
@api.put("/modify-author", auth=AuthBearer())
def modify_author_data(request, author: AuthorIn):
    token = request.headers.get('Authorization')
    author_query = retrieve_author(token)
    author_query.alias = author.alias
    author_query.about_you = author.about_you
    author_query.image = author.image
    author_query.save()
    return {"message": "Author profile has been created successfully", "status": 200}


@csrf_exempt
@api.put("/modify-user", auth=AuthBearer())
def modify_user(request, payload: ModifyUser):
    token = request.headers.get('Authorization')
    user = retrieve_user(token)
    if payload.username is not None:
        user.username = payload.username
    else:
        raise
    if payload.email is not None:
        user.email = payload.email
    user.save()
    return {"message": "User has been modified successfully", "status": 200}


@csrf_exempt
@api.delete("/logout", auth=AuthBearer())
def logout(request):
    token = request.auth
    Token.objects.filter(key=token).delete()
    return {"status": 200, "message": "User LoggedOut successfully"}

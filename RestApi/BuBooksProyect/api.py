
# DJANGO IMPORTS
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

# DJANGO-NINJA IMPORTS
from ninja import NinjaAPI, Schema, ModelSchema
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

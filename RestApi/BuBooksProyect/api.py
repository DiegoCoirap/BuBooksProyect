
from ninja import NinjaAPI, Schema, ModelSchema
# MODEL IMPORTS
from .models import Book, Category, Cart, Comment, Author, Sale, Wishlist, UserExtraData
from django.contrib.auth.models import User

api = NinjaAPI(csrf=False)


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

from crypt import methods
from flask import Flask, render_template, redirect, url_for, request
from flask_bootstrap import Bootstrap5
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from sqlalchemy import select, String
from wtforms import StringField, SubmitField
from wtforms.fields.simple import TextAreaField
from wtforms.validators import DataRequired, URL
from flask_ckeditor import CKEditor, CKEditorField
from datetime import date
import os
from flask_ckeditor import CKEditor
import datetime


app = Flask(__name__)
ckeditor = CKEditor(app)  #ckeditor
app.config['SECRET_KEY'] = '8BYkEfBA6O6donzWlSihBXox7C0sKR6b'
Bootstrap5(app)


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'posts.db')}"
db = SQLAlchemy()
db.init_app(app)

class AddForm(FlaskForm):
    post_title = StringField("Blog Post Title")
    subtitle = StringField("Subtitle")
    author_name = StringField("Your name")
    img_url = StringField("Blog Image URL")
    body = CKEditorField('Body')
    submit = SubmitField("Submit Post")


class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), unique=True, nullable=False)
    subtitle = db.Column(db.String(250), nullable=False)
    date = db.Column(db.String(250), nullable=False)
    body = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(250), nullable=False)
    img_url = db.Column(db.String(250), nullable=False)


with app.app_context():
    db.create_all()


@app.route('/')
def get_all_posts():
    result = db.session.execute(select(BlogPost).order_by(BlogPost.title))
    posts = result.scalars().all()
    return render_template("index.html", all_posts=posts)



@app.route('/post/<int:post_id>', methods=['POST', 'GET'])
def show_post(post_id):
    requested_post = db.get_or_404(BlogPost, post_id)
    if requested_post:
        return render_template("post.html", post=requested_post)




@app.route('/new-post', methods=['POST', 'GET'])
def add_new_post():
    form = AddForm()
    x = datetime.datetime.now()
    if form.validate_on_submit():
        new_post = BlogPost(
        title = form.post_title.data,
        date = x.strftime("%a %d, %Y"),
        author = form.author_name.data,
        subtitle = form.subtitle.data,
        img_url = form.img_url.data,
        body = form.body.data,
        )
        db.session.add(new_post)
        db.session.commit()
        return redirect(url_for('get_all_posts'))
    return render_template('make-post.html',form=form)



@app.route('/edit-post<int:id>', methods=['POST', 'GET'])
def edit_post(id):
    post = db.get_or_404(BlogPost, id)
    if post:
        edit_form = AddForm(
            post_title = post.title,
            subtitle = post.subtitle,
            author_name = post.author,
            img_url = post.img_url,
            body = post.body,
        )
        if edit_form.validate_on_submit():
                post.title = edit_form.post_title.data
                post.author = edit_form.author_name.data
                post.subtitle = edit_form.subtitle.data
                post.img_url = edit_form.img_url.data
                post.body = edit_form.body.data
                db.session.commit()
                return redirect(url_for('show_post',post_id=post.id))


        return render_template('make-post.html', form=edit_form, is_edit=True)


@app.route('/delete/<int:post_id>')
def delete_post(post_id):
    post = db.get_or_404(BlogPost, post_id)
    if post:
        db.session.delete(post)
        db.session.commit()
    return redirect(url_for('get_all_posts'))



@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


if __name__ == "__main__":
    app.run(debug=True, port=5003)

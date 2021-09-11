from unittest import TestCase
from jinja2.loaders import BaseLoader

from werkzeug.wrappers import response
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True
    def test_onHomePage(self):
        with self.client:
            self.client.get("/")
            self.assertIn('board', session)

    def test_game(self):
        with self.client:
            with self.client.session_transaction() as sess:
                sess['board'] = [["B","O","A","R","D"], ["B","O","A","R","D"], ["B","O","A","R","D"], ["B","O","A","R","D"], ["B","O","A","R","D"]]
            response = self.client.post('/word/board')
            self.assertEqual(response.json['result'], 'ok')
    def test_dictionary(self):
        self.client.get('/')
        response = self.client.post("/word/dictionary")
        self.assertEqual(response.json['result'], 'not-on-board')
        response = self.client.post("/word/ajhskdbvasd")
        self.assertEqual(response.json['result'], 'not-word')
from flask import Flask, json, redirect, request, render_template, session, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
app.config["SECRET_KEY"] = 'nimdA'
boggle_game = Boggle()

@app.route("/")
def show_home_page():
    session["board"] = session.get("board", boggle_game.make_board())
    return render_template("game.html", board = session["board"])

@app.route('/word/<input>', methods=["POST"])
def get_word_data(input):
    return jsonify(result=f"{boggle_game.check_valid_word(session['board'], input)}")

@app.route('/end/<stats>', methods=["POST"])
def save_stats(stats):
    session['plays'] = session.get('plays',0) + 1
    if int(stats) > int(session.get('highscore', 0)):
        session['highscore'] = stats
        return jsonify(newhighscore = session["highscore"])
    return jsonify(newhighscore = None)
@app.route('/data', methods=["GET"])
def send_highscore():
    return jsonify(highscore=session.get("highscore", 0), plays=session.get('plays',0))


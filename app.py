import os
from flask import Flask, render_template, request, url_for, jsonify
from markupsafe import Markup

# Initialize the Flask App
app = Flask(__name__)

from routes import *

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
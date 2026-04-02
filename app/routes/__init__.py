from flask import Blueprint

bp = Blueprint('main', __name__)

from . import main_routes, auth_routes, serrc_routes, promote_routes, api_routes, admin_routes

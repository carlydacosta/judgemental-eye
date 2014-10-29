import model
from datetime import datetime

def load_users(session):
    
    f = open("seed_data/u.user")
    for line in f:
        line = line.rstrip().split('|')
        user_id = line[0]
        age = line[1]
        zipcode = line[4]
        user = model.User(id=user_id, age=age, zipcode=zipcode)
        session.add(user)

def load_movies(session):

    f = open("seed_data/u.item")
    for line in f:
        line = line.rstrip().split('|')
        movie_id = line[0]
        title = line[1]
        title = title.decode("latin-1")
        imdb_url = line[4]
        year_released = line[2]
        # y = year_released.replace('-', ' ') 
        
        if year_released == '':
            d = None
            # movie = model.Movie(id=movie_id, name=title, imdb_url=imdb_url)
        else:
            d = datetime.strptime(year_released, '%d-%b-%Y')
        
        movie = model.Movie(id=movie_id, name=title, released_at=d, imdb_url=imdb_url)
        session.add(movie)
        
def load_ratings(session):

    f = open("seed_data/u.data")
    for line in f:
        line = line.rstrip().split('\t')
        rating = line[2]
        movie_id = line[1]
        user_id = line[0]
        rating = model.Rating(rating=rating, movie_id=movie_id, user_id=user_id)
        session.add(rating)

def main(session):
    # You'll call each of the load_* functions with the session as an argument
    load_users(session)
    load_movies(session)
    load_ratings(session)
    session.commit()
    

if __name__ == "__main__":
    s = model.connect()
    main(s)


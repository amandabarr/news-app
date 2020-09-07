const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

// render the homepage of the app, displaying mindfulness articles, a nav bar, and a search bar
function Homepage() {
  const [articles, setArticles] = React.useState([]);
  console.log(AuthContext);
  const onArticlesUpdated = (articles) => {
    setArticles(articles);
  };

  React.useEffect(() => {
    fetch("/api/top-news")
      .then((response) => response.json())
      .then((articles) => {
        console.log(articles);
        onArticlesUpdated(articles);
      });
  }, []);

  return (
    <div>
      <SearchBar onArticlesUpdated={onArticlesUpdated} />
      <NewsList articles={articles} />
    </div>
  );
}

// this component may be used to populate the nav bar
// may call default categories "default" and custom "custom" to make separate api calls?
// will have to update user favorite topics once selected

function DropDown() {
  // const [isVisible, setIsVisible] = React.useState();
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenu2"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Add Favorite Topic
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
        <button className="dropdown-item" type="button">
          Business
        </button>
        <button className="dropdown-item" type="button">
          Entertainment
        </button>
        <button className="dropdown-item" type="button">
          General
        </button>
        <button className="dropdown-item" type="button">
          Health
        </button>
        <button className="dropdown-item" type="button">
          General
        </button>
        <button className="dropdown-item" type="button">
          Science
        </button>
        <button className="dropdown-item" type="button">
          Technology
        </button>
      </div>
    </div>
  );
}

// allow a user to search for a specific topic keyword
function SearchBar(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const searchArgs = { topic_keyword: searchQuery };
    fetch(`/api/search?topic_keyword=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.onArticlesUpdated(data);
      });
  };

  const [searchQuery, setSearchQuery] = React.useState("");
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const resetForm = () => {
    setSearchQuery("search topic");
  };

  return (
    <div>
      <form id="search_form" onSubmit={handleSubmit}>
        <input
          value={searchQuery}
          id="topic_keyword"
          type="text"
          placeholder="search topic"
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

//

function NewsList(props) {
  const newsList = [];
  for (const article of props.articles) {
    newsList.push(
      <NewsListItem
        key={article["storyId"]}
        title={article["title"]}
        source={article["source"]["name"]}
        story_link={article["url"]}
        image={article["urlToImage"]}
        published={article["publishedAt"]}
        content={article["content"]}
        storyId={article["storyId"]}
        favorite={article["favorite"]}
      />
    );
  }

  return (
    <div>
      <ul>{newsList}</ul>
    </div>
  );
}

function NewsListItem(props) {
  const { loginData } = React.useContext(AuthContext);
  let articleImage;
  if (props.image != "null") {
    articleImage = <img src={props.image} />;
  } else {
    articleImage = <div>No image</div>;
  }

  // if (!loginData["isLoggedIn"])
  //   return alert("You need to be signed in to favorite an article");

  // fetch(`/api/favorites?storyId=${props.storyId}`, { method: isFavorite ? 'DELETE' : 'POST' })
  //   .then((response) => response.json())
  //   .then((json) => {
  //     if (json["success"]) {
  //       setIsFavorite(json.isFavorite);
  //     } else {
  //       alert(json.message)
  //     }
  //   });

  // a user can save an article to their favorites, or remove a saved article
  // if user is not logged in, alert notifies user to login to save an article
  const [isFavorite, setIsFavorite] = React.useState(props.favorite);
  const handleFavorite = (event) => {
    event.preventDefault();
    if (loginData.isLoggedIn) {
      // GET /api/favorites - list a user's favorites
      // use this for profile
      // POST /api/favorites - create a favorite
      // - fetch(`/api/favorites?storyId=${props.storyId}`, { method: 'POST' });
      // DELETE /api/favorites - deletes a favorite
      // - fetch(`/api/favorites?storyId=${props.storyId}`, { method: 'DELETE' })
      if (isFavorite) {
        fetch(`/api/remove_article?storyId=${props.storyId}`)
          .then((response) => response.json())
          .then((json) => {
            if (json["success"]) {
              setIsFavorite(false);
            }
          });
      } else {
        fetch(`/api/save_article?storyId=${props.storyId}`)
          .then((response) => response.json())
          .then((json) => {
            if (json["success"]) {
              setIsFavorite(true);
            }
          });
      }
    } else {
      alert("You need to be signed in to favorite an article");
    }
  };

  let favoriteButtonLabel = isFavorite
    ? "Remove from Favorites"
    : "Save to Favorites";
  return (
    <div className="card">
      <div className="row">
        <div className="col-6">
          <div className="card text-center">
            <img src={props.image} className="card-img-top" alt="..." />
            <div className="card-body">
              <a href={props.story_link}>Link</a>
              <h5 className="card-title">{props.title}</h5>
              <h6 className="card-title">{props.source}</h6>
              <p className="card-text">{props.content}</p>
              <a
                className="resp-sharing-button__link"
                href={`https://facebook.com/sharer/sharer.php?u=${props.story_link}`}
                target="_blank"
                rel="noopener"
                aria-label=""
              >
                <div className="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small">
                  <div
                    aria-hidden="true"
                    className="resp-sharing-button__icon resp-sharing-button__icon--solid"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                    </svg>
                  </div>
                </div>
              </a>

              <a
                className="resp-sharing-button__link"
                href={`https://twitter.com/intent/tweet/?url=${props.story_link}`}
                target="_blank"
                rel="noopener"
                aria-label=""
              >
                <div className="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small">
                  <div
                    aria-hidden="true"
                    className="resp-sharing-button__icon resp-sharing-button__icon--solid"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                    </svg>
                  </div>
                </div>
              </a>

              <button id="favorite" onClick={handleFavorite}>
                {favoriteButtonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// user can log in to their account, save news articles, and see these articles displayed on their profile page
function Login(props) {
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const { loginData, setLoginData } = React.useContext(AuthContext);
  console.log("login AuthContext", loginData);

  const handleUsernameChange = (event) => {
    event.preventDefault();
    console.log(event);
    setUserName(event.target.value);
  };
  const handlePasswordChange = (event) => {
    event.preventDefault();
    console.log(event);
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(username, password);
    fetch(`/api/login?username=${username}&password=${password}`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserName(data["username"]);
        setPassword(data["password"]);
        setUserId(data["user_id"]);
        console.log(userId);
        setLoginData({
          isLoggedIn: data["logged_in"],
          userId: data["user_id"],
          favoriteTopics: data.favoriteTopics,
        });
      });
  };

  let loginButton;
  if (loginData.isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div name="login">
      <form id="login_form" onSubmit={handleSubmit}>
        Username:
        <input
          value={username}
          id="username"
          type="text"
          onChange={handleUsernameChange}
        ></input>
        Password:
        <input
          value={password}
          id="password"
          type="text"
          onChange={handlePasswordChange}
        ></input>
        <button type="submit"> Login </button>
      </form>
    </div>
  );
}

function CreateAccount(props) {
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const { loginData, setLoginData } = React.useContext(AuthContext);
  console.log("login AuthContext", loginData);

  const handleUsernameChange = (event) => {
    event.preventDefault();
    console.log(event);
    setUserName(event.target.value);
  };
  const handlePasswordChange = (event) => {
    event.preventDefault();
    console.log(event);
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(username, password);
    fetch("/create_account", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserName(data["username"]);
        setPassword(data["password"]);
        setUserId(data["user_id"]);
        console.log(userId);
        setLoginData({
          isLoggedIn: data["logged_in"],
          userId: data["user_id"],
          favoriteTopics: data.favoriteTopics,
        });
      });
  };
  return (
    <div name="createAccount">
      <form id="createAccount" onSubmit={handleSubmit}>
        Username:
        <input
          value={username}
          id="username"
          type="text"
          onChange={handleUsernameChange}
        ></input>
        Password:
        <input
          value={password}
          id="password"
          type="text"
          onChange={handlePasswordChange}
        ></input>
        <button type="submit"> Create Account </button>
      </form>
    </div>
  );
}

// display the user's profile page with the user's saved articles
function Profile(props) {
  const { loginData } = React.useContext(AuthContext);
  console.log(Object.values(loginData));
  const [articles, setArticles] = React.useState([]);
  const onArticlesUpdated = (articles) => {
    setArticles(articles);
  };

  React.useEffect(() => {
    fetch(`/api/profile_stories?userId=${loginData["userId"]}`)
      .then((response) => response.json())
      .then((articles) => {
        console.log(articles);
        onArticlesUpdated(articles);
      });
  }, []);

  return loginData.isLoggedIn ? (
    <div>
      <SearchBar onArticlesUpdated={onArticlesUpdated} />
      <NewsList articles={articles} />
    </div>
  ) : (
    <p>Please Log In to see your saved articles</p>
  );
}

// mindfulness timer that pops alert after a period of time
// setInterval(function () {
//   alert("Take a deep breath");
// }, 10000);

// Context hook, so the user's log in status can be passed to multiple components
const AuthContext = React.createContext({});
const useAuthState = () => React.useContext(AuthContext);

// nav bar component  set state [{home: /}, {login: /login}, profile{route: /profile, title: profile}]
//map over state (built-in method for arrays),
// get user's fav topics, add topics to nav bar(append new), update the state

function App() {
  const [loginData, setLoginData] = React.useState({
    isLoggedIn: null,
    userId: null,
    favoriteTopics: [],
  });
  const logout = () => {
    fetch("/api/logout")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log("Your User ID is:", loginData);
        setLoginData({
          isLoggedIn: null,
          userId: null,
          favoriteTopics: [],
        });
      });
  };
  let loginLogoutButton;
  if (loginData.isLoggedIn === true) {
    loginLogoutButton = <Link onClick={logout}>Log Out</Link>;
  } else {
    loginLogoutButton = <Link to="/api/login">Log In</Link>;
  }

  const NavBar = () => {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo03"
            aria-controls="navbarTogglerDemo03"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <a className="navbar-brand">Mindful News</a>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item active">
                <a className="nav-link" href="/">
                  Home <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/api/profile">
                  Profile
                </a>
              </li>
            </ul>
            <ul className="nav justify-content-end">
              <li>
                <DropDown className="form-inline my-2 my-lg-0"></DropDown>
              </li>
            </ul>
            <SearchBar className="form-inline my-2 my-lg-0"></SearchBar>
          </div>
        </nav>
      </div>
    );
  };

  return (
    <AuthContext.Provider value={{ loginData, setLoginData }}>
      <Router>
        <div>
          {/* <nav>
            <ul>
              <li>
                <Link to="/"> Home </Link>
              </li>
              <li>
                <Link to="/create_account"> Sign Up </Link>
              </li>
              <li>{loginLogoutButton}</li>
              <li>
                <Link to="/api/profile"> Profile </Link>
              </li>
              {loginData.favoriteTopics.map((topic) => {
                return <li>{topic}</li>;
                // <Link to="/api/profile"> Profile </Link>;
              })}
              <li>
                <DropDown></DropDown>
              </li>
            </ul>
          </nav> */}
          <NavBar></NavBar>
          <Switch>
            <Route path="/api/profile">
              <Profile />
            </Route>
            <Route path="/api/login">
              <Login />
            </Route>
            <Route path="/create_account">
              <CreateAccount />
            </Route>
            <Route path="/">
              <Homepage />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

// inconsistencies between snake_case and camelCase - story_link vs storyId

// article["storyId"] vs *article.storyId*

// api naming - /remove vs /save_article - use REST

// early if returns for logged in states

// does save_article check if the user is logged in?
// - maybe this could handle the alert

// Use margins and padding instead of <br />

// /login?username=${username}&password=${password}
// - should be done as a POST

// /profile_stories should not accept userId, it should fetch it from the session

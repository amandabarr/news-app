const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

// render the homepage of the app, displaying mindfulness articles, a nav bar, and a search bar
function Homepage() {
  const [articles, setArticles] = React.useState([]);
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

function DropDown() {
  const [isVisible, setIsVisible] = React.useState();
  return (
    <div className="dropdown">
      <button className="dropbtn">Edit Favorites</button>
      <div className="dropdown-content">
        <a href="#">Topic 1</a>
        <br />
        <a href="#">Topic 2</a>
        <br />
        <a href="#">Topic 3</a>
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
    if (loginData["isLoggedIn"]) {
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
    <div>
      {console.log(props.storyId)}
      <a href={props.story_link}>{props.title}</a>
      <br />
      {props.source}
      <br />
      {props.published}
      <br />
      {articleImage}
      <br />
      {props.content}
      <br />
      <button id="favorite" onClick={handleFavorite}>
        {favoriteButtonLabel}
      </button>
    </div>
  );
}

// user can log in to their account, save news articles, and see these articles displayed on their profile page
function Login() {
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
    fetch(`/login?username=${username}&password=${password}`)
      .then((response) => response.json())
      .then((data) => {
        setUserName(data["username"]);
        setPassword(data["password"]);
        setUserId(data["user_id"]);
        console.log(userId);
        // setLoginData(data)
        setLoginData({
          isLoggedIn: data["logged_in"],
          userId: data["user_id"],
          favoriteTopics: data.favoriteTopics,
        });
      });
  };
  if (loginData["isLoggedIn"] == true) {
    return <Redirect to="/" />;
  }
  let loginButton;
  if (loginData["isLoggedIn"] == true) {
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

// display the user's profile page with the user's saved articles
function Profile(props) {
  const { loginData } = React.useContext(AuthContext);
  console.log(Object.keys(loginData));
  const [articles, setArticles] = React.useState([]);
  const onArticlesUpdated = (articles) => {
    setArticles(articles);
  };

  React.useEffect(() => {
    fetch(`/api/profile_stories?userId${loginData["userId"]}`)
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

// mindfulness timer that pops alert after a period of time
// setInterval(function () {
//   alert("Take a deep breath");
// }, 10000);

// Context hook, so the user's log in status can be passed to multiple components
const AuthContext = React.createContext({});
console.log(AuthContext);

// nav bar component  set state [{home: /}, {login: /login}, profile{route: /profile, title: profile}]
//map over state (built-in method for arrays),
// get user's fav topics, add topics to nav bar(append new), update the state

function App() {
  const [loginData, setLoginData] = React.useState({ favoriteTopics: [] });

  return (
    <AuthContext.Provider value={{ loginData, setLoginData }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/"> Home </Link>
              </li>
              <li>
                <Link to="/api/login"> Log In </Link>
              </li>
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
          </nav>
          <Switch>
            <Route path="/api/profile">
              <Profile />
            </Route>
            <Route path="/api/login">
              <Login />
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

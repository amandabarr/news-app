const { Button, Modal, Tabs } = ReactBootstrap;
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

// allow a user to search for a specific topic

function SearchBar(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const searchArgs = { topic_keyword: searchQuery };
    fetch(`/search?topic_keyword=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.onArticlesUpdated(data);
      });
  };

  // set state for search bar, begins as an empty string

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

//

function NewsListItem(props) {
  const { loginData } = React.useContext(AuthContext);
  let articleImage;
  if (props.image != "null") {
    articleImage = <img src={props.image} />;
  } else {
    articleImage = <div>No image</div>;
  }

  const handleFavorite = (event) => {
    event.preventDefault();
    alert(`handling fav: ${Object.keys(loginData)}`);
    if (loginData["isLoggedIn"] == true) {
      alert(`for UserId ${loginData["userId"]} Save Me to Favorites`);
      fetch(
        `/save_article?storyId=${props.storyId}`,
        console.log(loginData),
        console.log(props.storyId)
      );
    }
  };

  let favoriteButtonLabel = props.favorite
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

// user can log in to their account to see their saved articles

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
        setLoginData({
          isLoggedIn: data["logged_in"],
          userId: data["user_id"],
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

// display the user's profile page

function Profile(props) {
  const { loginData } = React.useContext(AuthContext);
  console.log(Object.keys(loginData));
  const [articles, setArticles] = React.useState([]);
  const onArticlesUpdated = (articles) => {
    setArticles(articles);
  };

  React.useEffect(() => {
    fetch(`/profile_stories?userId${loginData["userId"]}`)
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

// Context hook, so the user's log in status can be passed to multiple components

const AuthContext = React.createContext({});
console.log(AuthContext);

function App() {
  const [loginData, setLoginData] = React.useState({});

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
                <Link to="/login"> Log In </Link>
              </li>
              <li>
                <Link to="/profile"> Profile </Link>
              </li>
              {/* {user.topics.map(topic => )} */}
            </ul>
          </nav>
          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/login">
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

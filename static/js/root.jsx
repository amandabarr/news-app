const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

function Homepage() {
  return (
    <div>
      <SearchBar />
    </div>
  );
}

function SearchBar() {
  return (
    <div>
      Search:
      <input type="text"></input>
      <button> Search </button>
    </div>
  );
}

function NewsListItem(props) {
  return (
    <div>
      <a href={props.story_link}>{props.title}</a>
      <br />
      {props.source}
      <br />
      {props.published}
      <br />
      <img src={props.image} />
      <br />
      <button id="favorite"> Save to Favorites </button>
    </div>
  );
}

function NewsList(props) {
  const [topNewsList, setTopNewsList] = React.useState(["Loading..."]);

  React.useEffect(() => {
    fetch("/api/top-news")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newsList = [];
        for (const article of data) {
          newsList.push(
            <NewsListItem
              title={article["title"]}
              source={article["source"]["name"]}
              story_link={article["url"]}
              image={article["urlToImage"]}
              published={article["publishedAt"]}
            />
          );
        }
        console.log(newsList);
        setTopNewsList(newsList);
      });
  }, []);

  return (
    <div>
      <SearchBar />
      <ul>{topNewsList}</ul>
    </div>
  );
}

function Login(props) {
  return (
    <div>
      Username:
      <input type="text"></input>
      Password:
      <input type="password"></input>
      <button> Login </button>
    </div>
  );
}

function Profile() {
  return <div> React Demo Profile </div>;
}

function App() {
  // hello session['user]

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/user")
      .then((response) => response.json())
      .then((user) => setUser(user));
  }, []);

  return (
    <Router>
      {/* <h1>Hello {user.name}</h1>  */}
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/"> Home </Link>
            </li>
            <li>
              <Link to="/top-news"> Top News </Link>
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
          <Route path="/top-news">
            <NewsList />
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

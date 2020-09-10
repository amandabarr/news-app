const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useParams = ReactRouterDOM.useParams;
const useLocation = ReactRouterDOM.useLocation;
const { Navbar } = ReactBootstrap;
const { Nav, NavDropdown } = ReactBootstrap;
const { LinkContainer } = ReactRouterBootstrap;
const { Card, CardColumns, Row, Col } = ReactBootstrap;
const { Button } = ReactBootstrap;
const { Form } = ReactBootstrap;
const { FormControl } = ReactBootstrap;
const { Jumbotron, Container } = ReactBootstrap;
const { Modal } = ReactBootstrap;
const { Alert } = ReactBootstrap;

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
    <div id="articles">
      <NewsList articles={articles} />
    </div>
  );
}

// this component may be used to populate the nav bar
// may call default categories "default" and custom "custom" to make separate api calls?
// will have to update user favorite topics once selected

function TopicCategory(props) {
  const { topicCategory } = useParams();

  const [articles, setArticles] = React.useState([]);
  console.log(AuthContext);
  const onArticlesUpdated = (articles) => {
    setArticles(articles);
  };

  React.useEffect(() => {
    fetch(`/topicCategory?topicCategory=${topicCategory}`)
      .then((response) => response.json())
      .then((articles) => {
        console.log(articles);
        onArticlesUpdated(articles);
      });
  }, [topicCategory]);

  return (
    <div id="articles">
      <NewsList articles={articles} />
    </div>
  );
}

function Search(props) {
  const queryParams = useQuery();
  const query = queryParams.get("q");

  const [articles, setArticles] = React.useState([]);
  console.log(AuthContext);
  const onArticlesUpdated = (articles) => {
    setArticles(articles);
  };

  React.useEffect(() => {
    fetch(`/api/search?topic_keyword=${query}`)
      .then((response) => response.json())
      .then((articles) => {
        console.log(articles);
        onArticlesUpdated(articles);
      });
  }, [query]);

  return (
    <div id="articles">
      <NewsList articles={articles} />
    </div>
  );
}

function NewsList(props) {
  const newsList = [];
  for (const article of props.articles) {
    newsList.push(
      <NewsListItem
        key={article["storyId"]}
        title={article["title"]}
        source={article["source"]["name"]}
        story_link={article["url"]}
        description={article["description"]}
        image={article["urlToImage"]}
        published={article["publishedAt"]}
        content={article["content"]}
        storyId={article["storyId"]}
        favorite={article["favorite"]}
      />
    );
  }

  return (
    <div className="container">
      <div className="articleCards">
        <div className="row match-my-cols">
          <div className="col-12">
            {/* <div className"column-md-"> */}
            <CardColumns>{newsList}</CardColumns>
            {/* </div> */}
          </div>
        </div>
      </div>
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
    <Card>
      <a href={props.story_link}>
        <Card.Img variant="top" src={props.image} />
      </a>
      <Card.Body>
        <a href={props.story_link}>
          <Card.Title className="text-center">{props.title}</Card.Title>
        </a>
        <Card.Text className="text-center">{props.source}</Card.Text>
        <Card.Text>{props.description}</Card.Text>
      </Card.Body>
      <Card.Footer align="center" position="sticky">
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
        <Button id="favorite" onClick={handleFavorite} variant="primary">
          {favoriteButtonLabel}
        </Button>
      </Card.Footer>
    </Card>
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
      <form id="login_form" align="center" onSubmit={handleSubmit}>
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
      <p className="text-center">Create an Account</p>
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
      <div id="logInJumbotron" className="text-center">
        <Jumbotron fluid>
          <Container>
            <h1>Saved Articles</h1>
          </Container>
        </Jumbotron>
      </div>
      <div id="profileArticles">
        <NewsList articles={articles} />
      </div>
    </div>
  ) : (
    <div className="text-center">
      <Jumbotron fluid>
        <Container>
          <h1>Welcome</h1>
          <p>Please log in to see your saved articles.</p>
        </Container>
      </Jumbotron>
    </div>
  );
}

function MindfulAlert(props) {
  return (
    <div className="text-center">
      <Alert variant="dark" onClose={props.onAlertClosed} dismissible>
        <Alert.Heading>Mindfulness Break</Alert.Heading>
        <p>Take a few deep breaths!</p>
      </Alert>
    </div>
  );
}

// Context hook, so the user's log in status can be passed to multiple components
const AuthContext = React.createContext({});
const useAuthState = () => React.useContext(AuthContext);

// nav bar component  set state [{home: /}, {login: /login}, profile{route: /profile, title: profile}]
//map over state (built-in method for arrays),
// get user's fav topics, add topics to nav bar(append new), update the state

function App() {
  const [showMindfulMessage, setShowMindfulMessage] = React.useState(false);

  const startTimer = () => {
    setTimeout(() => {
      setShowMindfulMessage(true);
    }, 5000);
  };

  const onMindfulnessAlertClosed = () => {
    setShowMindfulMessage(false);
    startTimer();
  };
  const alertHtml = showMindfulMessage ? (
    <MindfulAlert onAlertClosed={onMindfulnessAlertClosed} />
  ) : (
    ""
  );

  React.useEffect(() => startTimer(), []);

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
  if (loginData.isLoggedIn) {
    loginLogoutButton = (
      <LinkContainer to="/">
        <Nav.Link onClick={logout}>Log Out</Nav.Link>
      </LinkContainer>
    );
  } else {
    loginLogoutButton = (
      <LinkContainer to="/api/login">
        <Nav.Link>Log In</Nav.Link>
      </LinkContainer>
    );
  }

  const [searchQuery, setSearchQuery] = React.useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <AuthContext.Provider value={{ loginData, setLoginData }}>
      <Router>
        <div>
          {alertHtml}
          <Navbar className="Navigation" expand="lg">
            <Navbar.Brand className="Brand">Mindful News</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <LinkContainer to="/">
                  <Nav.Link href="/">Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/api/profile">
                  <Nav.Link> Profile </Nav.Link>
                </LinkContainer>
                {loginLogoutButton}
              </Nav>
              <Form inline>
                <FormControl
                  title="Topics"
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                  onChange={handleSearchChange}
                />
                <LinkContainer to={`/search?q=${searchQuery}`}>
                  <Button class="btn btn-light">Search</Button>
                </LinkContainer>
              </Form>
            </Navbar.Collapse>
          </Navbar>
          <Nav
            id="secondaryNavigation"
            className="justify-content-center"
            activeKey="/home"
          >
            <Nav.Item>
              <LinkContainer to="/api/topicCategory/business">
                <Nav.Link>Business</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/api/topicCategory/entertainment">
                <Nav.Link>Entertainment</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/api/topicCategory/general">
                <Nav.Link>General</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/api/topicCategory/health">
                <Nav.Link>Health</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/api/topicCategory/science">
                <Nav.Link>Science</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/api/topicCategory/sports">
                <Nav.Link>Sports</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/api/topicCategory/technology">
                <Nav.Link>Technology</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
          <Switch>
            <Route path="/api/profile">
              <Profile />
            </Route>
            <Route path="/api/topicCategory/:topicCategory">
              <TopicCategory />
            </Route>
            <Route path="/search">
              <Search />
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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

ReactDOM.render(<App />, document.getElementById("root"));

// inconsistencies between snake_case and camelCase - story_link vs storyId

// article["storyId"] vs *article.storyId*

// api naming - /remove vs /save_article - use REST

// early if returns for logged in states

// does save_article check if the user is logged in?
// - maybe this could handle the alert

// /login?username=${username}&password=${password}
// - should be done as a POST

// /profile_stories should not accept userId, it should fetch it from the session

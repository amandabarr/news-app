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
    )
}



function Articles(props) {
    return (
        <div> 
            <SearchBar />
        </div>
    )
}

function SearchBar() {
    return (
        <div>
            Search:
            <input type="text"></input>
            <button> Search </button>
        </div>
    )
}

function Login(props) {
    return (
        <div>
            Username:
            <input type="text"></input>
            Password:
            <input type="text"></input>
            <button> Login </button>
        </div>
    )
}

function Profile() {
    return <div> React Demo Profile </div>
}


function App() {
    return (
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
    );
}

ReactDOM.render(<App />, document.getElementById('root'))
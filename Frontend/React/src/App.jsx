import { useEffect, useState } from "react";

var colors = {
  bg: "#0B1220",
  card: "#131B2E",
  border: "#232C42",
  accent: "#F2A93B",
  text: "#E7ECF5",
  muted: "#5C6884",
};

var USER_API = "http://localhost:8080/users";
var POST_API = "http://localhost:8080/posts";

function timeAgo(timestamp) {
  var minutes = Math.floor((Date.now() - timestamp) / 60000);

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return minutes + "m ago";
  }

  var hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return hours + "h ago";
  }

  var days = Math.floor(hours / 24);

  return days + "d ago";
}

export default function App() {
  var [posts, setPosts] = useState([]);

  var [mode, setMode] = useState("login");
  var [username, setUsername] = useState("");
  var [password, setPassword] = useState("");
  var [loggedIn, setLoggedIn] = useState(false);
  var [error, setError] = useState("");
  var [draft, setDraft] = useState("");

  useEffect(function () {
    fetch(POST_API)
      .then(function (response) {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then(function (data) {
        setPosts(data);
      })
      .catch(function () {
        setError("Unable to connect to backend");
      });
  }, []);

  function handleLogin() {
    if (username.trim() === "" || password.trim() === "") {
      setError("Enter both username and password");
      return;
    }

    fetch(USER_API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password,
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Incorrect username or password");
        }

        return response.json();
      })
      .then(function (user) {
        setUsername(user.username);
        setPassword("");
        setError("");
        setLoggedIn(true);
      })
      .catch(function (error) {
        setError(error.message);
      });
  }

  function handleRegister() {
    if (username.trim() === "" || password.trim() === "") {
      setError("Enter both username and password");
      return;
    }

    fetch(USER_API + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password,
      }),
    })
      .then(function (response) {
        if (response.status === 409) {
          throw new Error("Username already taken");
        }

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        return response.json();
      })
      .then(function () {
        setError("");
        setMode("login");
        setPassword("");
      })
      .catch(function (error) {
        setError(error.message);
      });
  }

  function switchMode() {
    if (mode === "login") {
      setMode("register");
    } else {
      setMode("login");
    }

    setError("");
    setPassword("");
  }

  function addPost() {
    if (draft.trim() === "") {
      return;
    }

    var newPost = {
      author: username,
      content: draft.trim(),
    };

    fetch(POST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then(function (savedPost) {
        setPosts([savedPost].concat(posts));
        setDraft("");
        setError("");
      })
      .catch(function () {
        setError("Unable to create post");
      });
  }

  function deletePost(id) {
    fetch(POST_API + "/" + id, {
      method: "DELETE",
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error();
        }

        var newPosts = [];

        for (var i = 0; i < posts.length; i++) {
          if (posts[i].id !== id) {
            newPosts.push(posts[i]);
          }
        }

        setPosts(newPosts);
        setError("");
      })
      .catch(function () {
        setError("Unable to delete post");
      });
  }

  var page = {
    background: colors.bg,
    color: colors.text,
    minHeight: "100vh",
    fontFamily: "monospace",
    padding: 20,
  };

  var inputStyle = {
    width: "100%",
    padding: 8,
    marginBottom: 8,
    background: colors.card,
    color: colors.text,
    border: "1px solid " + colors.border,
    borderRadius: 6,
    boxSizing: "border-box",
  };

  var buttonStyle = {
    width: "100%",
    padding: 8,
    background: colors.accent,
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
  };

  if (loggedIn === false) {
    var title = "Login";
    var switchText = "No account yet? Register";

    if (mode === "register") {
      title = "Register";
      switchText = "Already have an account? Login";
    }

    return (
      <div style={page}>
        <div style={{ maxWidth: 300, margin: "80px auto" }}>
          <h2>{title}</h2>

          <input
            value={username}
            onChange={function (e) {
              setUsername(e.target.value);
            }}
            placeholder="Enter username"
            style={inputStyle}
          />

          <input
            type="password"
            value={password}
            onChange={function (e) {
              setPassword(e.target.value);
            }}
            placeholder="Enter password"
            style={inputStyle}
          />

          {error !== "" && (
            <p style={{ color: "#E9738A", fontSize: 12 }}>
              {error}
            </p>
          )}

          {mode === "login" && (
            <button onClick={handleLogin} style={buttonStyle}>
              Login
            </button>
          )}

          {mode === "register" && (
            <button onClick={handleRegister} style={buttonStyle}>
              Register
            </button>
          )}

          <p
            onClick={switchMode}
            style={{
              fontSize: 12,
              color: colors.accent,
              marginTop: 10,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {switchText}
          </p>
        </div>
      </div>
    );
  }

  var postList = [];

  for (var i = 0; i < posts.length; i++) {
    var post = posts[i];

    var nameColor = colors.text;

    if (post.author === username) {
      nameColor = "#6EE7B7";
    }

    postList.push(
      <div
        key={post.id}
        style={{
          background: colors.card,
          border: "1px solid " + colors.border,
          borderRadius: 8,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <strong style={{ color: nameColor }}>
            {post.author}
          </strong>

          <span
            style={{
              color: colors.muted,
              fontSize: 12,
            }}
          >
            {post.createdAt
              ? timeAgo(new Date(post.createdAt).getTime())
              : "just now"}
          </span>
        </div>

        <div>{post.content}</div>

        <button
          onClick={function () {
            deletePost(post.id);
          }}
          style={{
            marginTop: 8,
            background: "none",
            border: "none",
            color: "#E9738A",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2>SoftwareTweetHub</h2>

        <p style={{ color: colors.muted }}>
          Logged in as {username} - {posts.length} posts
        </p>

        {error !== "" && (
          <p style={{ color: "#E9738A", fontSize: 12 }}>
            {error}
          </p>
        )}

        <div
          style={{
            background: colors.card,
            border: "1px solid " + colors.border,
            borderRadius: 8,
            padding: 10,
            marginBottom: 20,
          }}
        >
          <textarea
            value={draft}
            onChange={function (e) {
              setDraft(e.target.value);
            }}
            placeholder="What did you ship today?"
            rows={2}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: colors.text,
              fontFamily: "inherit",
              resize: "none",
            }}
          />

          <button
            onClick={addPost}
            style={{
              background: colors.accent,
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              float: "right",
              fontWeight: "bold",
            }}
          >
            Post
          </button>
        </div>

        <div style={{ clear: "both" }}>
          {postList}

          {posts.length === 0 && (
            <p style={{ color: colors.muted }}>
              No posts yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
      }

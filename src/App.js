import React from "react";
import AddButton from "./AddButton";
import Task from "./Task";
import DoInput from "./DoInput";
import axios from "axios";

class App extends React.Component {
  state = {
    newToDo: "",
    tasks: [],
    trySearch: "",
    createRequest: false,
    hideDones: false
  };

  checkToDo = async index => {
    await axios
      .post("https://jdommel-to-do-list-server.herokuapp.com/update", {
        id: this.state.tasks[index]._id
      })
      .then(response => {
        this.setState({ tasks: response.data });
      });
  };

  addTaskandNumber = async () => {
    await axios
      .post("https://jdommel-to-do-list-server.herokuapp.com/create", {
        title: this.state.newToDo
      })
      .then(response => {
        this.setState({ tasks: response.data });
      });
  };

  deleteToDo = async index => {
    await axios
      .post("https://jdommel-to-do-list-server.herokuapp.com/delete", {
        id: this.state.tasks[index]._id
      })
      .then(response => {
        this.setState({ tasks: response.data });
      });
  };

  renderToDos = () => {
    let taskArray = [];

    for (let i = 0; i < this.state.tasks.length; i++) {
      if (
        this.state.trySearch.length === 0 ||
        (this.state.trySearch.length > 0 &&
          this.state.tasks[i].title
            .toLowerCase()
            .includes(this.state.trySearch.toLowerCase()))
      ) {
        taskArray.push(
          <Task
            check={() => {
              this.checkToDo(i);
            }}
            key={this.state.tasks[i]._id}
            theme={this.state.tasks[i].done ? "done" : "undone"}
            text={this.state.tasks[i].title}
            delete={e => {
              this.deleteToDo(i);
            }}
          />
        );
      }
    }

    let undones = taskArray.filter(todo => todo.props.theme === "undone");
    let dones = taskArray.filter(todo => todo.props.theme === "done");

    let newArray;

    if (this.state.hideDones === false) {
      newArray = [...undones, ...dones];
    } else {
      newArray = [...undones];
    }

    return newArray;
  };

  render() {
    return (
      <div className="container">
        <h1>To-Do List</h1>
        <AddButton
          text={
            this.state.hideDones
              ? "Afficher toutes les tâches"
              : "Masquer ce qui n'est plus à faire"
          }
          onClick={() => {
            this.setState({ hideDones: !this.state.hideDones });
          }}
        />
        <div>
          <ul>{this.renderToDos()}</ul>
          <DoInput
            placeholder="Nouvelle tâche..."
            theme="do-input"
            value={this.state.newToDo}
            nbValue={this.state.newToDoNb}
            onInput={value => {
              this.setState({ newToDo: value });
            }}
            onNumberChange={value => {
              this.setState({ newToDoNb: value });
            }}
          />
        </div>
        <AddButton
          text="Ajouter tâche"
          onClick={() => {
            this.addTaskandNumber();
          }}
        />
        <div>
          <DoInput
            visibility="hidden"
            theme="search-input"
            placeholder="Cherchez une tâche"
            onInput={value => {
              this.setState({
                trySearch: value
              });
            }}
          />
        </div>
      </div>
    );
  }

  async componentDidMount() {
    await axios
      .get("https://jdommel-to-do-list-server.herokuapp.com/")
      .then(response => {
        this.setState({ tasks: response.data });
      });
  }
}

export default App;

import React from "react";
import AddButton from "./AddButton";
import Task from "./Task";
import DoInput from "./DoInput";
import axios from "axios";

class App extends React.Component {
  state = {
    isLoading: true,
    tasks: null,
    newToDo: "",
    trySearch: "",
    createRequest: false,
    hideDones: false
  };

  calculateToDo = () => {
    let count = 0;

    for (let i = 0; i < this.state.tasks.length; i++) {
      if (this.state.tasks[i].done === false) {
        count++;
      }
    }
    return count;
  };

  calculateDone = () => {
    let count = 0;

    for (let i = 0; i < this.state.tasks.length; i++) {
      if (this.state.tasks[i].done === true) {
        count++;
      }
    }
    return count;
  };

  checkToDo = async index => {
    this.setState({ isLoading: true });
    await axios
      .post("https://jdommel-to-do-list-server.herokuapp.com/update", {
        id: this.state.tasks[index]._id
      })
      .then(response => {
        this.setState({ tasks: response.data, isLoading: false });
      });
  };

  addTaskandNumber = async () => {
    this.setState({ isLoading: true });
    await axios
      .post("https://jdommel-to-do-list-server.herokuapp.com/create", {
        title: this.state.newToDo
      })
      .then(response => {
        const newTasks = [...this.state.tasks];
        newTasks.push(response.data);
        this.setState({ tasks: newTasks, isLoading: false, newToDo: "" });
      });
  };

  deleteToDo = async index => {
    this.setState({ isLoading: true });
    await axios
      .post("https://jdommel-to-do-list-server.herokuapp.com/delete", {
        id: this.state.tasks[index]._id
      })
      .then(response => {
        this.setState({ tasks: response.data, isLoading: false });
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
        <header>
          <div>
            <h1>To-Do List</h1>
          </div>
          <div className="count">
            <div>
              <i className="fas fa-times red-cross" />
              To do:
              {!this.state.isLoading && (
                <span>{this.calculateToDo()}</span>
              )}{" "}
            </div>
            <div>
              <i className="fas fa-check green-check" />
              Done :
              {!this.state.isLoading && <span>{this.calculateDone()}</span>}
            </div>
          </div>
        </header>

        <div>
          {/* Loader just for tasks */}
          {this.state.isLoading && <div>Loading tasks...</div>}
          {!this.state.isLoading && <ul>{this.renderToDos()}</ul>}
          <div>Cliquez sur la tâche pour rayer de la liste</div>
          <div>
            Appuyer sur la <i className="fas fa-times" /> pour effacer
            définitivement de la liste
          </div>
          <AddButton
            className="hide-done"
            text={
              this.state.hideDones
                ? "Afficher toutes les tâches"
                : "Masquer ce qui n'est plus à faire"
            }
            onClick={() => {
              this.setState({ hideDones: !this.state.hideDones });
            }}
          />
          <DoInput
            placeholder="Entrez une nouvelle tâche..."
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
          text="Ajouter une tâche"
          onClick={() => {
            this.addTaskandNumber();
          }}
        />
        <div>
          <DoInput
            visibility="hidden"
            theme="search-input"
            placeholder="Cherchez une tâche existante..."
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
        this.setState({ tasks: response.data, isLoading: false });
      });
  }
}

export default App;

import $ from 'jquery';

import Backbone from 'backbone';
import _ from 'underscore';


var Todo = Backbone.Model.extend({
  initialize: function() {
    // Put more things here.
  },
  defaults: {
    title: "Sample Title",
    description: "",
    completed: false
  }
});

var TodoList = Backbone.Collection.extend( {
  model: Todo,
  initialize: function(options) {
    this.comparator = 'title';
  }
});

var NewTaskView = Backbone.View.extend({
  tagName: 'section',
  newTodoTpl: _.template($("#tpl-new-task").html()),
  events: { // event Hash for responding to clicks
    'click .button': 'addNewTask'
  },
  render: function() {
    this.$el.html(this.newTodoTpl(this.model.toJSON()));
    return this;
  },
  addNewTask: function(options) {
    console.log("Button Clicked!");
  },
  initialize: function(options) {
    console.log("View Created");
    this.model = options.model;
    this.el = options.el;
  }
});

/*************  Individual Task View ******************/
var TaskView = Backbone.View.extend({
    tagName: 'li',
    taskTpl: _.template($("#tpl-task-titles").html()),
    events: {
      'click': 'selectTask'
    },
    render: function() {
      if (this.model) {
        this.$el.append(this.taskTpl(this.model.toJSON()));
        console.log("Rendering Model: " + this.model.get("title"));
      }

      return this;
    },
    selectTask: function(e) {
      console.log("selected " + this.model.get("title"));
    },
    initialize: function(options) {
      this.model = options.model;
      this.el = options.el;
      this.bus = options.bus;
    }
});
/**********    Task List View *************/
var TaskListView = Backbone.View.extend({
  taskListTpl: _.template($("#tpl-task-list").html()),
  render: function() {
    var that = this;
    this.$el.html(this.taskListTpl());

    this.collection.each(function(item) {

      var taskView = new TaskView({
        model: item,
        bus: that.bus
      });
      that.$('ul').append(taskView.render().$el);
      console.log("rendering: " + item.get("title"));
    });

    return this;
  },
  initialize: function(options) {
    this.collection = options.collection;
    this.el = options.el;
    this.bus = options.bus;
  }
});

/*************  Starter Data **************/
var taskData = [
  {
    title: 'Mow the lawn',
    description: 'Must be finished before BBQ on Sat afternoon'
  }, {
    title: 'Go to the Bank',
    description: 'Need to make a transfer'
  }, {
    title: 'Tune the Piano',
    description: 'High C is missing or something???'
  }
];

$(document).ready(function() {

  /***** Create Event Bus *****/
  var bus = {};
  bus = _.extend(bus, Backbone.Events);


  var myTodoList = new TodoList([
      new Todo({
        title: 'Mow the lawn',
        description: 'Must be finished before BBQ on Sat afternoon'
      }),
      new Todo({
        title: 'Go to the Bank',
        description: 'Need to make a transfer'
      })
  ]);
  var myTodoListView = new TaskListView({
    collection: myTodoList,
    bus: bus
  });

  /******** New Task View ***********/
  var newItemView = new NewTaskView({
    el: $('#new-task'),
    model: new Todo({
      title: "Go get groceries",
      description: "Get food!"
    })
  });
  $('#new-task').append(newItemView.render().el);

  $('#task-list').html(myTodoListView.render().$el);


  // var myTaskView = new TaskView({
  //   el: $('#task-list'),
  //   model: {
  //     title: 'Sample Task',
  //     description: 'I need to do this now!',
  //     completed: false
  //   }
  // });
  // $('.main-container').html(todosView.render().$el);
  //$('#task-list').html(myTodoListView.render().$el);
});

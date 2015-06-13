Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient){
  Meteor.subscribe('calendar', function(){
    Session.set('superCalendarReady', true);
  });

  Template.body.helpers({
    tasks: function(){
      //show newest task first
      return Tasks.find({}, {sort: {createAt: - 1}});
    }
  });

  Template.body.events({
    "submit .new-task": function(event){
      //this function is called when the new task form is submitted

      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createAt: new Date() //current time
      });

      //Clear form
      event.target.text.value = "";

      //prevent default form submit
      return false;
    },

    "click .toggle-checked": function(){
      //Set the checked property to the opposite of its current value
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },

    "click .delete": function(){
      Tasks.remove(this._id);
    }
  });
}

if (Meteor.isServer){
  Meteor.publish('calendar', function(){
    return Calendar.find();
  });
}
Tasks = new Mongo.Collection("tasks"); 

if (Meteor.isClient){
  Meteor.subscribe('calendar', function(){
    Session.set('superCalendarReady', true);
  });

  Template.body.helpers({
    tasks: function(){
      //show newest task first
      return Tasks.find({}, {sort: {date: 1}});
    }
  });
  
    // SuperCalendar.events.onDayClick = function (event, template, data) {
    // //pasa. Ya no pueden editar con click en el dia. 
    // // :((((((((
    // };
        
  Template.body.events({
    "submit .new-task": function(event){
      //this function is called when the new task form is submitted

      var title = event.target.title.value;
      var desc = event.target.desc.value;
      var date = event.target.date.value.split('-'); //(year-month-day)
      var time = event.target.time.value.split(':');

      var meses = {
        '01': "Enero",
        '02': "Febrero",
        '03': "Marzo",
        '04': "Abril",
        '05': "Mayo",
        '06': "Junio",
        '07': "Julio",
        '08': "Agosto",
        '09': "Septiembre",
        '10': "Octubre",
        '11': "Noviembre",
        '12': "Diciembre" 
      };

      var key = date[1];
      var str = meses[''+key];
      console.log(str);
      var newDate = date[2] + " de " + str;
  
      Tasks.insert({
        title: title,
        descripcion: desc,
        date: newDate, 
        time: time,
        createAt: new Date() //current time
      });

      date = new Date(date[0], date[1] - 1, date[2]);
      if (time) {
        date = new Date(date.setHours(time[0], time[1]));
      }

      Calendar.insert({
        title: title,
        start: date,
        allDay: false,
        description: desc
      });
      
      //Clear form
      event.target.title.value = "";
      event.target.desc.value = "";
      event.target.date.value = "";
      event.target.time.value = "";

      //prevent default form submit
      return false;
    },
        
      "click .news": function(){
          Eventos.value="BLAh";
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
  Calendar.allow({
    'insert':function(userId, doc){
      return true;
    }
  });
  Tasks.allow({
    'insert':function(userId,doc){
        return true;
    }
  })
}
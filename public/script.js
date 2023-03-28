var step = 1;
var refresh_delay = 1000;

function load_config() {
  $.get(window.location.href + "config", function (data) {
    // Set the title.
    // $(".title-wrapper .left span").text(data.task_list_title);
    // Set the title width.
    $(".title-wrapper .left").width(data.task_list_title_width);

    // Set up the item list.
    $("ul.task-list").empty();

    items = data.task_lists[data.task_list_selected];

    for (x in items) {
      var wrapperdiv = document.createElement("div");
      var imgdiv = document.createElement("div");
      var spandiv = document.createElement("div");
      var img = document.createElement("img");
      var span = document.createElement("span");

      wrapperdiv.classList.add("task-item");
      imgdiv.classList.add("image-div");
      spandiv.classList.add("span-div");
      span.textContent = items[x].text;
      img.classList.add("not-done");
      imgdiv.appendChild(img);
      spandiv.appendChild(span);
      wrapperdiv.appendChild(imgdiv);
      wrapperdiv.appendChild(spandiv);
      $(".task-list").append(wrapperdiv);
      // $("<li />").text(items[x]).appendTo($this);
    }
  });
}

function update_active_step() {
  $.get(window.location.href + "update", function (data) {
    jQuery.each(data, function (index, item) {
      var itemDiv = $(".task-list div.task-item").eq(index);
      var span = itemDiv.find("span")[0];
      var img = itemDiv.find("img")[0];
      if (span.textContent !== item.text) {
        span.textContent = item.text;
      }
      if (!$(img).hasClass(item.status)) {
        img.classList.toggle("done");
        img.classList.toggle("not-done");
      }
    });
  });
}

$(document).ready(function (e) {
  // Load configuration.
  load_config();

  // Set active step immediately, then update in loop.
  update_active_step();
  var interval = setInterval(update_active_step, refresh_delay);
});

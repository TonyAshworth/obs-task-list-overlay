# OBS Task List / Checklist Overlay

[![CI](https://github.com/tonyashworth/obs-task-list-overlay/actions/workflows/ci.yml/badge.svg?branch=master&event=push)](https://github.com/tonyashworth/obs-task-list-overlay/actions/workflows/ci.yml)

An HTML and Node.js-based task list overlay for OBS.

<img src="https://raw.githubusercontent.com/tonyashworth/obs-task-list-overlay/master/example.png" width="700" height="394" alt="OBS Task List Overlay Example with Tony Ashworth" />

I was heavily inspired by another streamers use of an onscreen checklist that allowed them to track progress towards each stream's goals.  These were usually specific to whatever game they were playing at the time and this felt incredibly powerful to keep chat engaged on what I was doing that evening.

Huge thanks to [PhishyLive](https://www.twitch.tv/phishylive) & [LaurynKHD](https://www.twitch.tv/laurynkhd) who inspired this adventure.

I saw another repo that had the bones of what I wanted but not the same result so I forked the repo ( https://github.com/geerlingguy/obs-task-list-overlay/ ) and within an hour had exactly what I wanted.

This project is still very much a WIP.

What's different between my project and the one I forked it from?

  1. I treat each task seperately, you could potentially do them out of order, the original was more focused on a sequence of tasks to be done in order.
  2. I removed the title / header as it wasn't necessary for my content.
  3. I added checkboxes to each item to allow you to see on screen which tasks are done vs not.

OK onto how does it work.

There are three components to this project:

  1. An HTML file (`index.html`), which lays out the task list/current status overlay.
  2. A Node.js HTTP server (`server.js`), which serves the HTML file to OBS, and allows you to update individual task statuses with a simple http get call.
  3. A config file (`config.json`), which provides the server settings, title settings, and task list content.

To see it in practice, check out this [solo DMZ](https://www.twitch.tv/videos/1732607502) livestream.

## Customizing the overlay

All the styling for the overlay is embedded in the `index.html` file. If you want to tweak the appearance, it should be easy enough if you know basic CSS + JS.

To set a title and set up the list of tasks, copy the `example.config.json` file to `config.json`, and then edit the file to add in the settings you would like.

## Node.js App setup

After you add your own task list and title, you need to get the Node.js server app running.

First, [install Node.js](https://nodejs.org/en/download/) on your computer.

Next, run the following command in this directory to install the app's dependencies:

```
npm install
```

Then start the local server:

```
node server.js
```

You can open the overlay in a regular web browser by visiting `http://localhost:8080/`, but note that the element sizes and spacing will differ from what is output in OBS.

Always use OBS as the final reference for how things will look during a stream!

## Using Docker Compose

To use the Docker images configured with compose, you need [docker-compose](https://docs.docker.com/compose/install/). Once it's up a running, you simply do

```
docker-compose up --detach
```

To stop the server

```
docker-compose down
```

The config maps container's `8080` port to `localhost:8080`. If you need to use another localhost port, you need to change it in `docker-compose.yml` under the `ports` section. For example, to use the port `3000` you need to set the section as:

```yaml
    ports:
      - "3000:8080"
```

The port number after the colon would be the port configured in `config.json`.

## Adding the browser source in OBS

  1. In an OBS Scene, add a new 'Browser' Source.
  2. For the URL, enter `http://localhost:8080/` (use the port you have configured in `config.json`).
  3. Set the width to `1920` and height to `1080`.
  4. Check the 'Refresh browser when scene becomes active' option.
  5. Click 'OK', and the overlay should appear.

## Advancing to the next step

To update a task's status, there is a route the Node.js app responds to:

The `/task-toggle` endpoint needs the `item` query parameter to know which task you want to toggle.

Remember the task list is a 0 based list so to change the status of the first task you call it like this : `/task-toggle?item=1`.

You can also toggle the task back to an incomplete state by calling it again.

You can check what the current task list values is by requesting `/current`.

When you have the browser source open, OBS will change the highlighted step within one second of you calling the  `/task-toggle` endpoint.

### Using an Elgato Stream Deck to advance steps

I use a Stream Deck to help with my live streaming, and I've created four buttons for this overlay.

<img src="https://raw.githubusercontent.com/tonyashworth/obs-task-list-overlay/master/streamdeck-buttons.png" width="480" height="166" alt="example of obs buttons setup" />

<img src="https://raw.githubusercontent.com/tonyashworth/obs-task-list-overlay/master/streamdeck-example.png" width="764" height="312" alt="example of obs button config" />

When I press a specific task button, that task updates on the next `/current` call.

To add a hotkey in the 'Configure Stream Deck' app, drag a 'Website' button from the 'System' section into one of the slots on your Stream Deck.

Then set the URL to `http://localhost/task-toggle?item=0` (or whatever task item you want set), and check 'Access in background'.

Now, when you press that key, the appropriate URL is called silently and the on-screen task list should update depending on the button you pressed. Magic!

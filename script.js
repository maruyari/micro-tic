'use strict';

var EMPTY = null;
var board_curr = [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]];
var player_is_x = true;
function initial_state() {
    return [[EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]];
}



(function () {

    function TicTacToe(args) {

        // Settings
        var $game = args.game,
            $scores = args.scores,
            $dialogs = args.dialogs,
            cols = [];

        $game.find('.row').each(function (i) {
            var row = [];
            $(this).find('.col').each(function (j) {
                row.push($(this));
            });
            cols.push(row);
        });

        // VARS
        var rows = [
                [cols[0][0], cols[0][1], cols[0][2]],
                [cols[1][0], cols[1][1], cols[1][2]],
                [cols[2][0], cols[2][1], cols[2][2]], // Hori

                [cols[0][0], cols[1][0], cols[2][0]],
                [cols[0][1], cols[1][1], cols[2][1]],
                [cols[0][2], cols[1][2], cols[2][2]], // Verti

                [cols[0][0], cols[1][1], cols[2][2]],
                [cols[0][2], cols[1][1], cols[2][0]] // Diago
            ],
            chars = {self: 'x', opponent: 'o'},
            scores = {self: 0, ties: 0, opponent: 0},
            turn = "self",
            isOpponent = false;


        /*
        ============================================
          UpdateScores Function.
        ============================================
        */
        function updateScores() {

            $scores.find('.p').find('u').html(scores.self);
            $scores.find('.ties').find('u').html(scores.ties);
            $scores.find('.com').find('u').html(scores.opponent);

        } // end-updateScores

        /*
        ============================================
          getCoords Function.
        ============================================
        */
        function getCoords(target) {

            for (var i = 0; i < cols.length; i++) {
                for (var j = 0; j < cols[i].length; j++) {
                    if (target.context === cols[i][j].context) {
                        return {row: i, col: j};
                    }
                }
            }

        } // end-getCoords

        /*
        ============================================
          AppendChar Function.
        ============================================
        */
        function appendChar(target, char) {

            if (target.hasClass('col') && target.children().length < 1) {
                target.append($(document.createElement('u')).addClass(char));
            }

        } // end-appendChar

        /*
        ============================================
          Blink Function.
        ============================================
        */
        function blink($el) {

            function rmClass() {
                $el.removeClass('blink');
            }

            $el.addClass('blink');
            setTimeout(rmClass, 1000);

        } // end-blink

        /*
        ============================================
          SwitchTurn Function.
        ============================================
        */
        function switchTurn() {

            if (turn === "self") {
                turn = "opponent";
            } else {
                turn = "self";
            }

        } // end-switchTurn

        /*
        ============================================
          Dialogs Function.
        ============================================
        */
        function dialogs(fade, dialog) {

            if (fade === 'out') {
                $dialogs.fadeOut(500, function () {
                    $dialogs.find('.end').find('.msg').html('');
                });
            } else {
                $dialogs.children().show();
                $dialogs.find('.' + dialog).hide(0, function () {
                    $dialogs.fadeIn(500);
                });
            }

        } // end-dialogs

        /*
        ============================================
          Action Function.
        ============================================
        */
        function action(action) {

            cols.forEach(function (row, i) {
                row.forEach(function (col, i) {

                    if (action === 'replay') {
                        col.children('u').remove();
                    } else if (action === 'tie') {
                        blink(col);
                    }

                });
            });

            if (action === 'replay') {
                dialogs('out', 'pick');
                switchTurn();
                if (turn === "opponent") {
                    setTimeout(opponent, 25);
                }
            } else if (action === 'win') {
                dialogs('in', 'pick');
            } else if (action === 'tie') {
                $dialogs.find('.msg').html('Tie');
                dialogs('in', 'pick');
            }

        } // end-action

        /*
        ============================================
          Winner Function.
        ============================================
        */
        function checkWinner() {

            function getRow(char) {

                rowsLoop:
                    for (var i = 0; i < rows.length; i++) {
                        for (var j = 0; j < rows[i].length; j++) {
                            if (!rows[i][j].children('u').first().hasClass(char)) {
                                continue rowsLoop;
                            }
                        }
                        return rows[i];
                    }

            } // end-getRow

            var p = getRow(chars.self),
                com = getRow(chars.opponent);

            if (p) {
                return {
                    name: 'p',
                    row: p
                };
            } else if (com) {
                return {
                    name: 'com',
                    row: com
                };
            }
            return false;

        } // end-checkWin

        function win(winner) {
            player_is_x = !player_is_x;
            board_curr = initial_state();

            function winAction(row, text) {
                row.forEach(function (col) {
                    blink(col);
                });
                $dialogs.find('.msg').html(text);
                action('win');
            } // action

            if (winner.name === 'p') {
                winAction(winner.row, 'You win!!');
                scores.self++;
                updateScores();
            } else if (winner.name === 'com') {
                winAction(winner.row, 'Computer wins!');
                scores.opponent++;
                updateScores();
            }

        } // end-win

        /*
        ============================================
          Tie Function.
        ============================================
        */
        function checkTie() {

            var emptyFound = false;
            colsLoop:
                for (var i = 0; i < cols.length; i++) {
                    for (var j = 0; j < cols[i].length; j++) {
                        if (!cols[i][j].children('u').length) {
                            emptyFound = true;
                            break colsLoop;
                        }
                    }
                }
            return !emptyFound;


        } // end-checkTie

        function tie() {
            player_is_x = !player_is_x;
            board_curr = initial_state();
            action('tie');
            scores.ties++;
            updateScores();

        } // end-tie
        //paste all functions here


        /*
        ============================================
          Computer Function.
        ============================================
        */
        function opponent() {

            if (isOpponent || !target.hasClass('col') || target.children('u').length) {
                return;
            }

            var coords = getCoords(target);
            board_curr[coords.row][coords.col] = chars.opponent;
            appendChar(cols[coords.row][coords.col], chars.opponent);

            if (checkWinner()) {
                var winner = checkWinner();
                win(winner);
                return;
            } else if (checkTie()) {
                tie();
                return;
            }

            isOpponent = true;
            setTimeout(opponent, 25);

        } // end-opponent


        /*
        ============================================
          Player Function.
        ============================================
        */
        function self(target) {

            if (isOpponent || !target.hasClass('col') || target.children('u').length) {
                return;
            }

            var coords = getCoords(target);
            board_curr[coords.row][coords.col] = chars.self;
            appendChar(cols[coords.row][coords.col], chars.self);

            if (checkWinner()) {
                var winner = checkWinner();
                win(winner);
                return;
            } else if (checkTie()) {
                tie();
                return;
            }

            isOpponent = true;
            //setTimeout(opponent, 25);

        } // end-self

        /*
        ============================================
          Events Function.
        ============================================
        */
        $game.on('click', function (e) {

            var target = $(e.target);

            self(target);

        });

        $dialogs.find('.pick').find('button').on('click', function (e) {
//come here
            var target = $(e.target);
            if (target.hasClass('x')) {
                chars.self = 'x';
                chars.opponent = 'o';
                player_is_x = true;
                $scores.find('.p').find('.char').html('X');
                $scores.find('.com').find('.char').html('O');
            } else {
                chars.self = 'o';
                chars.opponent = 'x';
                $scores.find('.p').find('.char').html('O');
                $scores.find('.com').find('.char').html('X');
                player_is_x = false;
            }
            dialogs('out', 'pick');

        });

        $dialogs.find('.end').find('.replay').on('click', function (e) {

            action('replay');

        });

    } // end-TicTacToe
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    $(document).ready(function () {

        // Create a client instance
        // var client = new Paho.MQTT.Client("test.mosquitto.org", 8080,makeid(10));
        //
        // // set callback handlers
        // client.onConnectionLost = onConnectionLost;
        // client.onMessageArrived = onMessageArrived;
        //
        // // connect the client
        // client.connect({onSuccess:onConnect});
        //
        //
        // // called when the client connects
        // function onConnect() {
        //     // Once a connection has been made, make a subscription and send a message.
        //     console.log("onConnect");
        //     client.subscribe("World");
        //     var message = new Paho.MQTT.Message("Hello");
        //     message.destinationName = "World";
        //     client.send(message);
        // }
        //
        // // called when the client loses its connection
        // function onConnectionLost(responseObject) {
        //     if (responseObject.errorCode !== 0) {
        //         console.log("onConnectionLost:"+responseObject.errorMessage);
        //     }
        // }
        //
        // // called when a message arrives
        // function onMessageArrived(message) {
        //     console.log("onMessageArrived:"+message.payloadString);
        // }

        // DOM
        let $game = $('.game'),
            $scores = $('.scores'),
            $dialogs = $('.dialogs');
        debugger;
        let game = new TicTacToe({

            game: $game,
            scores: $scores,
            dialogs: $dialogs

        });

    });

})();

const url_api = 'https://api-game-dino.herokuapp.com';

function output(inp) {
    document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function check (username) {
    const url = `${url_api}/api/players/info`;

    output(syntaxHighlight(`[api][post] Send query api: ${url}; params:`));
    output(syntaxHighlight(JSON.stringify({ username: username }, undefined, 4)));

    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'json',
        data: {
            username
        },
        success: function(data){  
            output(syntaxHighlight(`[server][answer][200]`));
            let str = JSON.stringify(data, undefined, 4);
            output(syntaxHighlight(str));

            if (data.success) {
                if (data.response.state.type != 'play') {
                    $('.main').hide();
                    $('.play').show();
                    $('.in_game').hide();
                } else {
                    $('.main').hide();
                    $('.play').hide();
                    $('.in_game').show();

                    $('#level_id').html(`Level ID: ${data.response.state.levelID}`);
                }

                window.localStorage.setItem('username', data.response.username);
                window.localStorage.setItem('player_id', data.response.player_id);

                $('#stamina_info').html(
                    `Stamina: ${data.response.stamina.current}/${data.response.stamina.max}, Last update: ${new Date(data.response.stamina.time_last_add * 1000)}`
                );
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            output(syntaxHighlight(`[server][answer][${xhr.status}]`));
            let str = JSON.stringify(xhr.responseJSON, undefined, 4);
            output(syntaxHighlight(str));
        }
    });
}

$(document).ready(() => {
    output(syntaxHighlight('[page] Loaded'));
    output(syntaxHighlight(`[api] url: ${url_api}`));

    $('#reload_page').click(function() {
        document.location.reload();
    });
    
    if (localStorage.getItem('username')) {
        $('.main').hide();
        $('.play').show();
        check(localStorage.getItem('username'));
    }

    $('#join_game').click(function() {
        let url = `${url_api}/api/players/check`;

        const username = $('#join_input_username').val();
        const player_name = $('#join_input_name').val();

        output(syntaxHighlight(`[api][post] Send query api: ${url}; params:`));
        output(syntaxHighlight(JSON.stringify({ username: username, player_name: player_name }, undefined, 4)));

        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: {
                username,
                player_name
            },
            success: function(data){  
                output(syntaxHighlight(`[server][answer][200]`));
                let str = JSON.stringify(data, undefined, 4);
                output(syntaxHighlight(str));

                if (data.success) {
                    $('.main').hide();
                    $('.play').show();

                    window.localStorage.setItem('username', data.response.username);
                    window.localStorage.setItem('player_id', data.response.player_id);
                } else {
                    check(username);
                }

                $('#stamina_info').html(
                    `Stamina: ${data.response.stamina.current}/${data.response.stamina.max}, Last update: ${new Date(data.response.stamina.time_last_add * 1000)}`
                );
            },
            error: function (xhr, ajaxOptions, thrownError) {
                output(syntaxHighlight(`[server][answer][${xhr.status}]`));
                let str = JSON.stringify(xhr.responseJSON, undefined, 4);
                output(syntaxHighlight(str));
            }
        });
    });

    $('#all_players').click(function() {
        const url = `${url_api}/api/players`;
        output(syntaxHighlight(`[api][get] Send query api: ${url}`));

        $.ajax({
            url: url,
            method: 'GET',  
            success: function(data){  
                output(syntaxHighlight(`[server][answer][200]`));
                let str = JSON.stringify(data, undefined, 4);
                output(syntaxHighlight(str));
            }
        });
    });

    $('#find_by_username').click(function() {
        const url = `${url_api}/api/players/info`;

        const username = $('#input_by_username').val();

        output(syntaxHighlight(`[api][post] Send query api: ${url}; params:`));
        output(syntaxHighlight(JSON.stringify({ username: username | '' }, undefined, 4)));

        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: {
                username
            },
            success: function(data){  
                output(syntaxHighlight(`[server][answer][200]`));
                let str = JSON.stringify(data, undefined, 4);
                output(syntaxHighlight(str));
            },
            error: function (xhr, ajaxOptions, thrownError) {
                output(syntaxHighlight(`[server][answer][${xhr.status}]`));
                let str = JSON.stringify(xhr.responseJSON, undefined, 4);
                output(syntaxHighlight(str));
            }
        });
    });

    $('#logout').click(function() {
        $('.main').show();
        $('.play').hide();
        $('.in_game').hide();

        window.localStorage.removeItem('username');
        window.localStorage.removeItem('player_id');
    });

    $('#game_play').click(function() {
        let url = `${url_api}/api/game/play`;
        let player_id = localStorage.getItem('player_id');

        output(syntaxHighlight(`[api][post] Send query api: ${url}; params:`));
        output(syntaxHighlight(JSON.stringify({ player_id: player_id }, undefined, 4)));

        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: {
                player_id
            },
            success: function(data){  
                output(syntaxHighlight(`[server][answer][200]`));
                let str = JSON.stringify(data, undefined, 4);
                output(syntaxHighlight(str));

                if (data.success) {
                    $('.main').hide();
                    $('.play').hide();
                    $('.in_game').show();

                    $('#level_id').html(`Level ID: ${data.response.state.levelID}`);

                    window.localStorage.setItem('level_id', data.response.state.levelID);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                output(syntaxHighlight(`[server][answer][${xhr.status}]`));
                let str = JSON.stringify(xhr.responseJSON, undefined, 4);
                output(syntaxHighlight(str));
            }
        });
    });

    const game_exit = () => {
        let url = `${url_api}/api/game/leave`;
        let player_id = localStorage.getItem('player_id');

        output(syntaxHighlight(`[api][post] Send query api: ${url}; params:`));
        output(syntaxHighlight(JSON.stringify({ player_id: player_id }, undefined, 4)));

        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: {
                player_id
            },
            success: function(data){  
                output(syntaxHighlight(`[server][answer][200]`));
                let str = JSON.stringify(data, undefined, 4);
                output(syntaxHighlight(str));

                if (data.success) {
                    $('.main').hide();
                    $('.play').show();
                    $('.in_game').hide();

                    window.localStorage.removeItem('level_id');

                    $('#stamina_info').html(
                        `Stamina: ${data.response.stamina.current}/${data.response.stamina.max}, Last update: ${new Date(data.response.stamina.time_last_add * 1000)}`
                    );
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                output(syntaxHighlight(`[server][answer][${xhr.status}]`));
                let str = JSON.stringify(xhr.responseJSON, undefined, 4);
                output(syntaxHighlight(str));
            }
        });
    }

    $('#game_exit').click(game_exit);
    $('#game_lose').click(game_exit);

    $('#game_win').click(function() {
        let url = `${url_api}/api/game/win`;
        let player_id = localStorage.getItem('player_id');
        let level_id = parseInt(localStorage.getItem('level_id'));

        output(syntaxHighlight(`[api][post] Send query api: ${url}; params:`));
        output(syntaxHighlight(JSON.stringify({ player_id: player_id, level_id: level_id }, undefined, 4)));

        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: {
                player_id,
                level_id
            },
            success: function(data){  
                output(syntaxHighlight(`[server][answer][200]`));
                let str = JSON.stringify(data, undefined, 4);
                output(syntaxHighlight(str));

                if (data.success) {
                    $('.main').hide();
                    $('.play').show();
                    $('.in_game').hide();

                    window.localStorage.removeItem('level_id');

                    $('#stamina_info').html(
                        `Stamina: ${data.response.stamina.current}/${data.response.stamina.max}, Last update: ${new Date(data.response.stamina.time_last_add * 1000)}`
                    );
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                output(syntaxHighlight(`[server][answer][${xhr.status}]`));
                let str = JSON.stringify(xhr.responseJSON, undefined, 4);
                output(syntaxHighlight(str));
            }
        });
    });

    $('#game_replay').click(function() {
        let url = `${url_api}/api/game/replay`;
        let player_id = localStorage.getItem('player_id');

        output(syntaxHighlight(`[api][post] Send query api: ${url}; params:`));
        output(syntaxHighlight(JSON.stringify({ player_id: player_id }, undefined, 4)));

        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: {
                player_id
            },
            success: function(data){  
                output(syntaxHighlight(`[server][answer][200]`));
                let str = JSON.stringify(data, undefined, 4);
                output(syntaxHighlight(str));

                if (data.success) {
                    $('.main').hide();
                    $('.play').hide();
                    $('.in_game').show();

                    window.localStorage.setItem('level_id', data.response.state.levelID);

                    $('#stamina_info').html(
                        `Stamina: ${data.response.stamina.current}/${data.response.stamina.max}, Last update: ${new Date(data.response.stamina.time_last_add * 1000)}`
                    );
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                output(syntaxHighlight(`[server][answer][${xhr.status}]`));
                let str = JSON.stringify(xhr.responseJSON, undefined, 4);
                output(syntaxHighlight(str));
            }
        });
    });

    $('#clear_log').click(function() {
        $('pre').remove();
    });

    setInterval(() => {
        if (localStorage.getItem('username'))
            check(localStorage.getItem('username'));
    }, 30 * 1000);
});

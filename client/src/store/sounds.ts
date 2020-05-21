export const playSound = (sound: string): void => {
    switch (sound) {
        case 'player_leave':
            const player_leave = new Audio('sounds/leave.ogg');
            player_leave.play();
            break;
        case 'player_join':
            const player_join = new Audio('sounds/join.ogg');
            player_join.play();
            break;
        case 'message_sent':
            const message_sent = new Audio('sounds/chat.ogg');
            message_sent.play();
            break;
        case 'goal':
            const goal = new Audio('sounds/goal.ogg');
            goal.play();
            break;
        case 'stage_change':
            const highlight = new Audio('sounds/stage.ogg');
            highlight.play();
            break;
        case 'ball_kicked':
            const kick = new Audio('sounds/kick.ogg');
            kick.play();
            break;
    }
}
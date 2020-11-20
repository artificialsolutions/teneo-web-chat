// api methods
export const API_CALL_MAXIMIZE = "maximize";
export const API_CALL_MINIMIZE = "minimize";
export const API_CALL_SEND_INPUT = "send_input";
export const API_CALL_END_SESSION = "end_session";
export const API_CALL_CLEAR_CHAT_HISTORY = "clear_chat_history";
export const API_CALL_RESET = "reset";
export const API_CALL_ADD_MESSAGE = "add_message";
export const API_CALL_SET_CHAT_WINDOW_TITLE = "set_chat_window_title";
export const API_CALL_RESET_CHAT_WINDOW_TITLE = "reset_chat_window_title";
export const API_CALL_SET_CHAT_WINDOW_ICON = "set_chat_window_icon"
export const API_CALL_RESET_CHAT_WINDOW_ICON = "reset_chat_window_icon"
export const API_CALL_SET_LAUNCH_ICON = "set_launch_icon"
export const API_CALL_RESET_LAUNCH_ICON = "reset_launch_icon"
export const API_CALL_RESET_SEND_ICON = "reset_send_icon";
export const API_CALL_SET_SEND_ICON = "set_send_icon";
export const API_CALL_HIDE_CALLOUT = "hide_callout"
export const API_CALL_SHOW_CALLOUT = "show_callout"
export const API_CALL_SET_ENGINE_URL = "set_engine_url";
export const API_CALL_DISABLE_USERINPUT = 'disable_user_input';
export const API_CALL_ENABLE_USERINPUT = 'enable_user_input';
export const API_SET_LOCALE = "set_locale"

//Add dedicated add typing indicator method
export const API_CALL_HIDE_TYPING_INDICATOR = 'hide_typing_indicator';
export const API_CALL_SHOW_TYPING_INDICATOR = 'show_typing_indicator';

// api getters
export const API_GET_STATE = "state";
export const API_GET_CHAT_HISTORY = "chat_history";
export const API_GET_ENGINE_URL = "engine_url";
export const API_GET_STORAGE = "storage";
export const API_GET_LOCALE = "locale";

// api callacks
export const API_ON_READY = "ready";
export const API_ON_VISIBILITY_CHANGED = "visibility_changed";
export const API_ON_INPUT_SUBMITTED = "input_submitted";
export const API_ON_USER_TYPING = "user_typing";
export const API_ON_ENGINE_REQUEST = "engine_request";
export const API_ON_ENGINE_RESPONSE = "engine_response";
export const API_ON_NEW_MESSAGE = "new_message";
export const API_ON_BUTTON_CLICK = "message_button_clicked";
export const API_ON_OPEN_BUTTON_CLICK = "open_button_clicked";
export const API_ON_CLOSE_BUTTON_CLICK = "close_button_clicked";
export const API_ON_MINIMIZE_BUTTON_CLICK = "minimize_button_clicked";
export const API_ON_MODAL_BUTTON_CLICK = "modal_button_clicked";
export const API_ON_SEND_BUTTON_CLICK = "send_button_clicked";
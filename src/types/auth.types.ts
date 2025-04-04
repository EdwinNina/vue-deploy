export interface SystemLogin {
    access_token:  string;
    refresh_token: string;    
    systemData: SystemData;
    userData:       any;
}

export interface SystemData {
    systemId: string
    roles:   Role[];
    modules: Module[];
}

export interface Module {
    mod_name:  string;
    mod_path:  string;
    mod_order: number;
    mod_icon:  string;
    children:  Child[];
}

export interface Child {
    mod_id:         string;
    mod_name:       string;
    mod_path:       string;
    mod_icon:       string;
    mod_order:      number;
}

export interface Role {
    role_name:         string;
    actions: Actions[]
}

export interface Actions {
    act_name:     string;
    act_key_name: string;
}

export interface User {
    id:            string;
    username:      string;
    email:         string;
    active:        boolean;
    countAttempts: number;
    verified:      boolean;
    createdAt:     Date;
    totalSystems:  number;
}
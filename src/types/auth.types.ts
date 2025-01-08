export interface ModuleAction {
    actions: {
        act_name: string;
        act_key_name: string;
    };
}

export interface Role {
    role_name: string;
    roleModuleActions: {
        moduleAction: ModuleAction;
    }[];
}

export interface Module {
    mod_id?: string;
    mod_name: string;
    mod_path: string;
    mod_icon: string;
    mod_order: number;
    mod_is_active?: boolean;
    mod_created_at?: string;
    mod_updated_at?: string;
    mod_parent_id?: string;
    mod_sys_id?: string;
    children?: Module[];
}

export interface SystemData {
    roles: Role[];
    modules: Module[];
}

export interface User {
    id: string;
    username: string;
    email: string;
    active: boolean;
    countAttempts: number;
    verified: boolean;
    createdAt: string;
    totalSystems: number;
}

export interface Tokens {
    access_token: string;
    refresh_token: string;
}

export interface AuthData {
    tokens: Tokens;
    systemData: SystemData;
    user: User;
}
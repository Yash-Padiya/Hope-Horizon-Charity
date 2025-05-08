export const findLink = (pathname: string | undefined) => {
    switch (pathname) {
        case "/":
            return 0;
        case "/admin/dashboard":
            return 1;
        case "/admin/donor-dashboard":
            return 2;
        case "/admin/campaigns-dashboard":
            return 3;
        case "/admin/helpcenter":
            return 4;
        case "/admin/volunteer-dashboard":
            return 5;
        default:
            return -1;
    }
};

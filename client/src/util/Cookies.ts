
export class Cookies{
    public static setCookie(name: string,value: string,days: number) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    public static getCookie(name: string): string | undefined {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (const element of ca) {
            let c = element;
            while (c.startsWith(' ')) c = c.substring(1, c.length);
            if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length).trim();
        }
        return undefined;
    }
    
    public static eraseCookie(name: string) {   
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}


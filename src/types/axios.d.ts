declare module 'axios/lib/adapters/xhr' {
    import { AxiosAdapter } from 'axios';

    const XHRAdapter: AxiosAdapter;

    export default XHRAdapter;
}
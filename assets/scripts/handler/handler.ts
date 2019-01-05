export default class handler
{
    private cb:Function;
    private host:any;
    private args:any[];

    constructor(cb:Function, host = null, ...args)
    {
        this.cb = cb;
        this.host = host;
        this.args = args;
    }

    exec(...extras)
    {
        this.cb.apply(this.host, this.args.concat(extras));
    }
}

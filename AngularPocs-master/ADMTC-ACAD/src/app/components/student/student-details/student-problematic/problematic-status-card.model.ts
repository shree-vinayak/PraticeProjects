export default class ProblematicStatusCardModel {
    public textKey : String;
    public isChecked: Boolean;
    public clazz : String;
    public isVisible: Boolean;
    
    private defaultKey: String;
    private successKey: String;
    private failureKey: String;

    readonly DEFAULT_CLASS = 'yellowBG';
    readonly FAILURE_CLASS = 'redBG';

    readonly UNCHECKED = 1;
    readonly CHECKED = 2;

    constructor(
        defaultKey: String,
        successKey: String,
        failureKey: String
    ) {
        this.defaultKey = defaultKey;
        this.successKey = successKey;
        this.failureKey = failureKey;

        this.setDefault();

    }

    setDefault() {
        this.textKey = this.defaultKey;
        this.clazz = this.DEFAULT_CLASS;
        this.isChecked = false;
        this.isVisible = true;
    }

    setDone(): void {
        this.textKey = this.successKey;
        this.clazz = this.DEFAULT_CLASS;
        this.isChecked = true;
        this.isVisible = true;
    }

    setFailed(): void {
        this.textKey = this.failureKey;
        this.clazz = this.FAILURE_CLASS;
        this.isChecked = false;
        this.isVisible = true;
    }

    setHidden(): void {
        this.isVisible = false;
    } 

}
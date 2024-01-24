
export default interface SemoaProCreate {

    orderReference: string
    state: StateInterface,
    thirdPartyReference:string
}

interface StateInterface {
    label: string
}
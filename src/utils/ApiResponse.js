class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=MediaDeviceInfo
        this.success=statusCode<400
    }
}

export { ApiResponse }
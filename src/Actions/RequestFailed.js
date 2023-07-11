
export default function RequestFailed(xhr, textStatus, errorThrown){

    console.warn(`${textStatus} | ${errorThrown}`);

    const text = xhr.responseJSON ?
    xhr.responseJSON.error.message.value :
    errorThrown;
    
    return swal({
        icon: textStatus,
        title: errorThrown,
        text,
        buttons: {
            cancel: {
                text: 'Close',
                visible: true,
                closeModal: true,
            }
        },
    });

}
const FormError = ({error} : { error?: string }) => {
  
    if (!error) return;

    return (
    <div className="text-red-500 text-sm">FormError</div>
  )
}

export default FormError
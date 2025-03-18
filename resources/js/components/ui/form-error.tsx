const FormError = ({ error }: { error?: string }) => {
  if (!error) return null; // Se não houver erro, não renderiza nada

  return (
      <div className="text-red-500 text-sm">
          {error} {/* Exibe a mensagem de erro */}
      </div>
  );
}

export default FormError;

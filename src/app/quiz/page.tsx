  const handleFinish = () => {
    // Salvar answers, talvez localStorage
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    router.push('/welcome');
  };
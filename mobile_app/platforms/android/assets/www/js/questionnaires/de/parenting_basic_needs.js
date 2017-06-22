var Questionnaires = Questionnaires || {}; 

Questionnaires.GermanParentingBasicNeeds = function() {
  this.title = 'Wie geht es Ihnen gerade?';

  this.scale = {
    left: 'stimme überhaupt nicht zu',
    right: 'stimme völlig zu'
  }

  this.items = [
    {
      key: 'parenting_basic_needs_1',
      text: 'Ich fühle mich mit meinem Kind verbunden. '
    },
    {
      key: 'parenting_basic_needs_2',
      text: 'Ich fühle mich gut als Mutter/ Vater.'
    },
    {
      key: 'parenting_basic_needs_3',
      text: 'Ich weiss, wie ich in dieser Situation reagieren muss.'
    },
    {
      key: 'parenting_basic_needs_4',
      text: 'Ich fühle mich frei mein Kind so zu erziehen wie ich es gut finde.'
    }
  ];
};

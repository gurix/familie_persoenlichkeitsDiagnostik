var Questionnaires = Questionnaires || {}; 

Questionnaires.GermanParentingSkills = function() {
  this.title = 'Beschreiben Sie die aktuelle Situation:';

  this.scale = {
    left: 'stimme überhaupt nicht zu',
    right: 'stimme völlig zu'
  }

  this.items = [
    {
      key: 'parenting_skills_1',
      recoded: 0,
      text: 'Die auftretenden Erziehungsprobleme kann ich leicht lösen.'
    },
    {
      key: 'parenting_skills_2',
      recoded: 0,
      text: 'Ich weiss, was mit meinem Kind los ist.'
    },
    {
      key: 'parenting_skills_3',
      recoded: 0,
      text: 'Ich verfüge über alle nötigen Fertigkeiten eine gute Mutter/ ein guter Vater zu sein.'
    },
    {
      key: 'parenting_skills_4',
      recoded: 1,
      text: 'Ich fühle mich manipuliert.'
    },
    {
      key: 'parenting_skills_5',
      recoded: 1,
      text: 'Ich fühle mich so als ob ich nichts schaffen würde.'
    },
    {
      key: 'parenting_skills_6',
      recoded: 1,
      text: 'Ich fühle mich als Elternteil ängstlich und angespannt.'
    }
  ];
};

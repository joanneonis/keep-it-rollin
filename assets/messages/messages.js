export const staticMessages = {
  welcome: {
    storyId: 1,
    messages: [
      'Hallo!',
      'Ik zie dat je de tool nog niet eerder hebt gebruikt! Ik zal je even helpen opstarten.',
      'Het doel is simpel. **Hou het balletje rollende!** Aan de hand van jouw taken krijg je tips hoe je dit kan doen.',
      'Zullen we gewoon starten? Voor meer informatie kan je terecht bij het info knopje.'
    ],
    actions: [
      {
        type: 'button--secondary',
        text: 'Meer info',
        action: 'moreInfo'
      },
      {
        type: 'button--primary',
        text: 'Start met bouwen',
        action: 'start'
      }
    ]
  },
  connectCalendar: {
    storyId: 2,
    messages: [
      'Oh! Voordat we beginnen, wil je een **Google Calender** koppelen? Dan kan ik betere tips geven, en al wat bouwwerkzaamheden voorbereiden.',
      'Taken die je hier invult kan je dan ook direct in je agenda laten vullen.'
    ],
    actions: [
      {
        type: 'button--secondary',
        text: 'Misschien later',
        action: 'later'
      },
      {
        type: 'button--primary',
        text: 'Koppel agenda',
        action: 'connectCalendar'
      }
    ]
  }
}

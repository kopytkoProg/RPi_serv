/**
 * Created by michal on 2014-12-12.
 */

var DS18B20D = {

    Descriptions: [
        {
            id: '28-0000058f448c',
            name: 'Pod sufitem',
            description: 'Czujnik temperatury umieszczony pod sufitem'
        },
        {
            id: '28-0000058f8de4',
            name: 'Na fotelu',
            description: 'Czujnik temperatury umieszczony na fotelu'
        }
    ],


    DescriptionFor: function (id)
    {
        var selected = this.Descriptions.filter(function (e)
        {
            return e.id == id;
        });

        return selected.length == 1 ? selected[0] : null;
    }


};

module.exports = DS18B20D;
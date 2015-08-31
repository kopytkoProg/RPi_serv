/**
 * Created by michal on 2014-12-12.
 */




var DS18B20D = {

    //'',
    //'

    /**
     * Id lik 00-000... ar used and generated by RPI
     * Id like 00:00:00:... are used and generated by esp device
     */
    Descriptions: [
        {
            id: '28-0000058f448c',
            //===========================================================================
            innerId: 'michalsRoomCeilingCurtain',
            name: 'Pod sufitem',
            description: 'Czujnik temperatury umieszczony pod sufitem',
            icon: 'fa fa-home'
        },
        {
            id: '28-0000058f8de4',
            //===========================================================================
            innerId: 'firstFlorOutside1',
            name: 'Na dworze',
            description: 'Czujnik temperatury umieszczony na dworze (1 pietro, Południowa strona)',
            icon: 'fa fa-cloud'
        },
        {
            id: 'unassigned_1',
            //===========================================================================
            innerId: 'michalsRoomFree1',
            name: 'Na fotelu',
            description: 'Czujnik temperatury umieszczony na fotelu'
        },


        {
            id: '28:ff:da:60:62:14:03:e4',
            //===========================================================================
            innerId: 'boilerRoomHeatingInstallation-out',
            name: 'Woda z pieca',
            description: 'Czujnik temperatury umieszczony na róże wyjsciowej z pieca',
            icon: 'fa fa-fire'
        },
        {
            id: 'unassigned_2',
            //===========================================================================
            innerId: 'boilerRoomHeatingInstallation-in',
            name: 'Woda do pieca',
            description: 'Czujnik temperatury umieszczony na róże wejściowej z pieca'
        },
        {
            id: '28:ff:5c:79:62:14:03:18',
            //===========================================================================
            innerId: 'boilerRoom-waterInBoiler',
            name: 'Woda w bojlerze',
            description: 'Czujnik temperatury przy bojlerze',
            icon: 'fa fa-database'
        }
    ],




    /**
     *
     * @param id
     * @returns {DS18B20DDescriptionObject} description object
     */
    DescriptionFor: function (id)
    {
        var selected = this.Descriptions.filter(function (e)
        {
            return e.id == id;
        });

        return selected.length == 1 ? selected[0] : {
            id: id,
            //===========================================================================
            innerId: 'Unknown',
            name: 'Unknown',
            description: 'Unknown'
        };
    }


};


module.exports = DS18B20D;


/**
 * Description object
 * @typedef {Object} DS18B20DDescriptionObject
 * @property {string} id
 * @property {string} innerId
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 */


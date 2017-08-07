var mymap = L.map('mapid').setView([47.23985, 39.71094], 17);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZWxlbWVudDI4MDEwNSIsImEiOiJjajV4dmxxaDMwNzUxMndudXdmNTZmamM3In0.KRySBP_mg9ukuzO0HlZABw'
}).addTo(mymap);


var markers = [
    {
        coordinate: [47.24103, 39.70929],
        header: 'Легкоатлетический манеж',
        description: 'Здесь проводятся различные соревнованя, пары по физре',
        icon: L.icon({
            iconUrl: './img/sport.png',
            iconSize: [38, 38]
        })
    },
    {
        coordinate: [47.23933, 39.71047],
        header: 'Памятник студентам и сотрудникам РИСХМ',
        description: 'Памятник студентам и преподавателям РИСХМА, погибшим в годы Великой Отечественной войны',
        icon: L.icon({
            iconUrl: './img/monument.png',
            iconSize: [38, 38]
        })
    },
    {
        coordinate: [47.23937, 39.71105],
        header: 'Храм',
        description: 'Местная религиозная организация православный приход храма мученицы Татианы при ' +
        'Донском государственном техническом университете Ростовской-на-Дону Епархии Русской ' +
        'Православной Церкви (Московский Патриархат)',
        icon: L.icon({
            iconUrl: './img/church.png',
            iconSize: [38, 38]
        })
    },
    {
        coordinate: [47.23880, 39.71091],
        header: 'Бассейн "Универ"',
        description: 'В бассейне ДГТУ "Универ" в Ростове-на-Дону - 6 дорожек, длина составляет 25 метров, ' +
        'глубина - 1,2-1,8 метра. Температура воды составляет 27-28 градусов. Используется система обеззараживания ' +
        'воды с пониженным содержанием хлора. Проводятся занятия плаванием (в группе и индивидуально).',
        icon: L.icon({
            iconUrl: './img/pool.png',
            iconSize: [38, 38]
        })
    }
];


markers.forEach(function (item, i, arr) {
    var marker = L.marker(item.coordinate, {icon: item.icon}).addTo(mymap);
    marker.bindPopup("<b>" + item.header + "</b><br>" + item.description);
});

L.control.mousePosition().addTo(mymap);
L.Control.measureControl().addTo(mymap);


const myModel = new Backbone.Model();

const markerCollection = new Backbone.Collection(markers);

const MarkerView = Mn.View.extend({
    template: _.template('' +
        '<div class="panel-heading">' +
        '   <h4 class="panel-title">' +
        '       <a data-toggle="collapse" data-parent="#items" href="#<%= coordinate %>"><%= header %></a>' +
        '   </h4>' +
        '</div>' +
        '<div id="<%= coordinate %>" class="panel-collapse collapse">' +
        '   <div class="panel-body"><%= description %></div>' +
        '</div>'),
    tagName: 'div',
    className: 'panel panel-default',
    model: myModel,
    triggers: {
        'click a': 'select:item'
    }
});

const MarkerCollectionView = Mn.CollectionView.extend({
    childView: MarkerView,
    collection: markerCollection,
    tagName: 'div',
    id: 'items',
    className: 'panel-group',

    onChildviewSelectItem(childView) {
        var $_panelBody = childView.$el.find(".panel-collapse");
        if ($_panelBody) {
            $_panelBody.collapse('toggle')

            if ($_panelBody.attr('aria-expanded') === "true") {
                mymap.setView(childView.model.attributes.coordinate, 20);
            }
        }
    }
});

const myCollectionView = new MarkerCollectionView();

myCollectionView.render();
$('#items_container').append(myCollectionView.$el);
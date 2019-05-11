var config = {
    apiKey: "AIzaSyCj_LnrpRwvEH7FwcrYgPMBkhjG5eWIIO4",
    authDomain: "ggh-db.firebaseapp.com",
    databaseURL: "https://ggh-db.firebaseio.com",
    projectId: "ggh-db",
    storageBucket: "ggh-db.appspot.com",
    messagingSenderId: "37231611683"
};
firebase.initializeApp(config);

var db = firebase.firestore();

let _uid, _utype;
window.onload = () => {
    firebase.auth().onAuthStateChanged(function(user){
        if(!user || user.isAnonymous) {
            document.getElementById('logout').style.display = 'none';
            document.getElementById('login').style.display = 'block';
            document.getElementById('auth0').style.display = 'none';
            location.pathname = "/main";
        } else {
            var displayName = user.displayName;
            var email = user.email || user.phoneNumber;
            var photoURL = user.photoURL;
            _uid = user.uid;
            db.collection("USERS").doc(_uid).get().then(doc => {
                const data = doc.data();
                // sign(data.UTYPE * 1);                
                document.getElementById('logout').style.display = 'block';
                document.getElementById('login').style.display = 'none';
                document.getElementById('auth0').style.display = 'block';
                document.getElementById('auth1').innerHTML = displayName;
                document.getElementById('auth2').innerHTML = email;
                if (photoURL != null) document.getElementById('auth3').setAttribute('src', photoURL);

                if (data.stage && data.stage != null && data.stage != undefined) {
                    db.collection("STAGE").doc(data.stage).get().then(doc => {
                        const data2 = doc.data();
                        if (data2.a) {
                            //승인 완료 시 정보 표시
                            document.getElementById('name').innerHTML = data2.name;
                            let s = "";
                            s += "<p>info: " + data2.info + "</p>"
                            s += "<p>hook: " + data2.hook + "</p>"
                            s += "<p>address: " + data2.address + "</p>"
                            s += "<p>tell: " + data2.tell + "</p>"
                            s += "<p>web: " + data2.web + "</p>"
                            s += "<p>workhour: " + data2.workhour + "</p>"
                            s += "<p>seat: " + data2.seat + "</p>"

                            //카테고리
                            s += "<p>"
                            for (let i in data2.category) {
                                s += "<span>#" + data2.category[i] + "</span>";
                            }
                            s += "</p>"
                            document.getElementById('infos').innerHTML = s;

                            //지도
                            Maping(data2.place);
                            var marker = new google.maps.Marker({
                                position: {lat: data2.place[0], lng: data2.place[1]},
                                map: map
                            });
                            marker.setMap(map);

                            //공연 정보
                            db.collection("STAGE").doc(data.stage).collection("event").get().then(querySnapshot => {
                                let s2 = "";
                                querySnapshot.forEach(doc => {
                                    s2 += "<p>" + doc.id + " => " + JSON.stringify(doc.data()) + "</p><hr />";
                                });
                                document.getElementById("event").innerHTML = s2;
                            });
                        } else {
                            //승인 대기중
                            alert("승인 대기 중입니다.");
                        }
                    });
                } else {
                    location.pathname = "/manager/add"
                }
            });
        }
    }, function(error){
        console.log(error);
    });
    anime({
        targets: '.fbtn',
        bottom: '25px',
        rotate: '720'
    });
}

var sign = n => {
    n = n * 1;
    if (n == 1) location.pathname = "/artist";
    if (n == 2) location.pathname = "/main";
}

var logout = () => {
    firebase.auth().signOut().then(function(){
        location.pathname = "/main";
    }).catch(function(error){
        console.log(error);
    })
}

var menu = () => {
    location.pathname = "/manager/event/add"
}
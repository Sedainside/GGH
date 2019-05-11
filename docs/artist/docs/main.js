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
    load();
    firebase.auth().onAuthStateChanged(function(user){
        if(!user || user.isAnonymous) {
            document.getElementById('logout').style.display = 'none';
            document.getElementById('login').style.display = 'block';
            document.getElementById('auth0').style.display = 'none';
        } else {
            var displayName = user.displayName;
            var email = user.email || user.phoneNumber;
            var photoURL = user.photoURL;
            _uid = user.uid;
            db.collection("USERS").doc(_uid).get().then(doc => {
                data = doc.data();
                sign(data.UTYPE * 1);                
                document.getElementById('logout').style.display = 'block';
                document.getElementById('login').style.display = 'none';
                document.getElementById('auth0').style.display = 'block';
                document.getElementById('auth1').innerHTML = displayName;
                document.getElementById('auth2').innerHTML = email;
                if (photoURL != null) document.getElementById('auth3').setAttribute('src', photoURL);

                if (data.A_a != null && data.A_a != undefined) {
                    // 어딘가에 프로필 보여주기
                    let s = "";
                    s += "<p>nickname: " + data.A_name + "</p>"
                    s += "<p>info: " + data.A_info + "</p>"
                    s += "<p>birth: " + data.A_birth + "</p>"
                    s += "<p>tell: " + data.A_phone + "</p>"
                    document.getElementById("profile").innerHTML = s;
                } else {
                    location.pathname = "/artist/add"
                }
            });
            db.collection("USERS").doc(_uid).collection("applies").get().then(querySnapshot => {
                let s2 = "";
                querySnapshot.forEach(doc => {
                    s2 += "<p onclick = \"check('" + doc.data().ref.path + "');\">" + doc.id + "<br/><b>클릭해서 신청 확인 ㄱ</b></p><hr />";
                });
                document.getElementById("applies").innerHTML = s2;
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

var load = () => {
    db.collection("STAGE").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const data2 = doc.data();
            var marker = new google.maps.Marker({
                position: {lat: data2.place[0], lng: data2.place[1]},
                map: map
            });
            marker.addListener('click', function() { S_i_o(doc.id) });
            marker.setMap(map);
        });
    });
}

var S_i_o = s => {
    console.log(s);
    db.collection("STAGE").doc(s).get().then(doc => {
        const Data = doc.data();
        document.getElementById("S_n").innerHTML = Data.name;
        document.getElementById("S_a").innerHTML = Data.address;
        document.getElementById("S_m").addEventListener("click", () => {
            //사이트 주소 수정
            location.href = "https://ggh-db.firebaseapp.com/artist/info?s=" + s;
        })

        let t = "";
        for (let i in Data.category) {
            t += "<span class='S_c_t'>#" + Data.category[i].trim() + "</span>";
        }
        document.getElementById('S_c').innerHTML = t;        

        anime({
            targets: '.fbtn',
            bottom: '185px',
            rotate: '720'
        });
        anime({
            targets: '.S_box',
            delay: 50,
            bottom: '-50px'
        });
    })
}

var S_i_c = () => {
    anime({
        targets: '.fbtn',
        delay: 50,
        bottom: '25px',
        rotate: '720'
    });
    anime({
        targets: '.S_box',
        bottom: '-220px'
    });
}

var check = r => {
    db.doc(r).get().then(doc => {
        alert(doc.data().a);
    });
}

var sign = n => {
    n = n * 1;
    // if (n == 1) location.pathname = "/artist";
    if (n == 2) location.pathname = "/main";
    if (n == 3) location.pathname = "/manager";
}

var logout = () => {
    firebase.auth().signOut().then(function(){
        location.reload();
    }).catch(function(error){
        console.log(error);
    })
}
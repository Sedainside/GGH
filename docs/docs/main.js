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
    document.getElementById("s00").style.display = "none";
    document.getElementById("s3").style.display = "none";
    document.getElementById("s5").style.display = "none";
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
                sign(doc.data().UTYPE * 1);                
                document.getElementById('logout').style.display = 'block';
                document.getElementById('login').style.display = 'none';
                document.getElementById('auth0').style.display = 'block';
                document.getElementById('auth1').innerHTML = displayName;
                document.getElementById('auth2').innerHTML = email;
                if (photoURL != null) document.getElementById('auth3').setAttribute('src', photoURL);
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
            location.href = "https://ggh-db.firebaseapp.com/info?s=" + s;
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

var sign = n => {
    n = n * 1;
    if (n == 1) location.pathname = "/artist";
    // if (n == 2) location.pathname = "/";
    if (n == 3) location.pathname = "/manager";
}

var logout = () => {
    firebase.auth().signOut().then(function(){
        location.reload();
    }).catch(function(error){
        console.log(error);
    })
}

var searchON = () => {
    document.getElementById('sPage').style.display = "block";
    document.getElementById('s1').style.display = "none";
    document.getElementById('s00').style.display = "block";
    document.getElementById('s2').style.display = "block";
    document.getElementById('s3').style.display = "block";
    document.getElementById('s5').style.display = "block";
    document.getElementById('searchbox').classList.remove('mdl-shadow--4dp');
    document.getElementById('s4').focus();
}

var searchClear = () => {
    document.getElementById('s4').value = "";
    document.getElementById('s4').focus();
}

var searchOFF = s => {
    document.getElementById('sPage').style.display = "none";
    document.getElementById('s1').style.display = "block";
    document.getElementById('s00').style.display = "none";
    document.getElementById('s2').style.display = "none";
    document.getElementById('s3').style.display = "none";
    document.getElementById('s5').style.display = "none";
    document.getElementById('searchbox').classList.add('mdl-shadow--4dp');

    
    // if (s != "") S_i_o(s);
    document.getElementById('s1').innerHTML = "여기서 검색";
}

document.getElementById("s2").onkeyup = (e) => {
    if (e.keyCode > 64 || (e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 32 || e.keyCode == 8) {
        k = [];
        const value = document.getElementById("s4").value.toUpperCase();      
        /* db.collection("_INDEX").doc("library").get().then(function(doc) {
            if (doc.exists) {
                document.getElementById("s9").innerHTML = "";
                const key = doc.data().NAME;
                const type = doc.data().TYPE
                
                for (let i in key) {
                    const x = key[i].toUpperCase().split(value);
                    if (key[i] != x[0]) {
                        k.push(key[i]);

                        let ans = "";
                        for (let j in x) {
                            if (j != 0) {
                                ans += "<b>" + value + "</b>";
                            }
                            ans += x[j];
                        }

                        let icon = "";
                        if (type[i] == "ssss") icon = "local_cafe";
                        else if (type[i] == "sss") icon = "local_library";
                        else icon = "book";

                        let a = "";
                        a += "<li class='mdl-list__item mdl-list__item--two-line' onclick=\"searchOFF('" + key[i] + "');\">";
                        a += "    <span class='mdl-list__item-primary-content'>";
                        a += "        <i class='material-icons mdl-list__item-icon'>" + icon + "</i>";
                        a += "        <span>" + ans + "</span>";
                        a += "        <span class='mdl-list__item-sub-title'>" + type[i] + "</span>";
                        a += "    </span>";
                        a += "</li>";
                        document.getElementById("s9").innerHTML += a;
                    }
                }
                
                if (document.getElementById("s9").innerHTML == "" || document.getElementById("s4").value == "") {
                    let a = "";
                    a += "<li class='mdl-list__item mdl-list__item--two-line'>";
                    a += "    <span class='mdl-list__item-primary-content'>";
                    a += "        <i class='material-icons mdl-list__item-icon'>priority_high</i>";
                    a += "        <span>검색 결과가 존재하지 않습니다</span>";
                    a += "        <span class='mdl-list__item-sub-title'>검색어를 확인해주세요</span>";
                    a += "    </span>";
                    a += "</li>";
                    document.getElementById("s9").innerHTML = a;
                }
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        }); */
    } else if (e.keyCode == 13) {
        // searchOFF(document.getElementById("s4").value);
    } else {
        event.preventDefault();
    }
}
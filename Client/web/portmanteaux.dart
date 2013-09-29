import 'dart:html';
import 'dart:json' as json;
import 'package:web_ui/web_ui.dart';

var wordList;
var saveUser;
var httpPostRequest;
@observable String serverResponse = '';

// This map contains the rest of the form data.
@observable Map theData = toObservable({
  'username':      'username',
  'password':  'password',
  'email':       'email'
});

void main() {
  wordList = query('#wordList');
  query('#saveUser').onClick.listen(makePostRequest);
  query('#getWords').onClick.listen(makeRequest);

  
}
// A get Request
void makeRequest(Event e) {
  //var path = 'sample.json';
  var path = 'http://127.0.0.1:1212/getdartusers';
  var httpRequest = new HttpRequest();
  httpRequest
  ..open('GET', path)
  ..onLoadEnd.listen((e) => requestComplete(httpRequest))
  ..send('');
}
//A post request
void makePostRequest(Event e) {
  //var path = 'sample.json';
  e.preventDefault();
  print ('post request');
  var path1 = 'http://127.0.0.1:1212/insertdartmongouser';
  httpPostRequest = new HttpRequest();
  httpPostRequest.onReadyStateChange.listen(onData(e)); 
  
  httpPostRequest.open('POST', path1);
  httpPostRequest.send(userJsonData());
}

String userJsonData() {
  // Put date in the map.
  //myData['favoriteThings'] = favoriteThings;
  print ('userJsonData');
  
  var usernm = query('#usernameid');
  var passwd = query('#passwordid');
  var eml = query('#emailid');
  
  theData['username'] = usernm.value;
  theData['password'] = passwd.value;
  theData['email'] = eml.value;
  usernm.value='';
  passwd.value='';
  eml.value='';
  print("mydata="+json.stringify(theData));
  return json.stringify(theData);
}

void onData(Event e) {
  print ('onData');
  
  
  if (httpPostRequest.readyState == HttpRequest.DONE &&
      httpPostRequest.status == 200) {
    // Data saved OK.
    serverResponse = 'Server Sez: ' + httpPostRequest.responseText;
    print (serverResponse);
  } else if (httpPostRequest.readyState == HttpRequest.DONE &&
      httpPostRequest.status == 0) {
    // Status is 0...most likely the server isn't running.
    serverResponse = 'No server';
    print (serverResponse);
  }
}



requestComplete(HttpRequest request) {
  print(request.status);
  print(request.statusText);
  
  if (request.status == 200) {
    List samples = json.parse(request.responseText);
    wordList.children.clear();
    for (int i = 0; i < samples.length; i++) {
      var myObject = samples[i];
      wordList.children.add(new LIElement()..text = myObject['name']);
    }
  } else {
    wordList.children.add(new LIElement()..text =
        'Request failed, status={$request.status}');
  }
}
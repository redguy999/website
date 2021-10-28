//this is a js file
var x=document.getElementById("MyLocation");
   function getLocation() {
       if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, showError);} 
       else { x.innerHTML = "Geolocation is not supported by this browser.";}
       }
   function showPosition(position) {
       x.innerHTML = "Latitude: " + position.coords.latitude + 
       "<br>Longitude: " + position.coords.longitude;
       }
       function showError(error) {
        switch(error.code) {
           case error.PERMISSION_DENIED:
             x.innerHTML = "User denied the request for Geolocation."
           break;
           case error.POSITION_UNAVAILABLE:
           x.innerHTML = "Location information is unavailable."
           break;
           case error.TIMEOUT:
           x.innerHTML = "The request to get user location timed out."
           break;
           case error.UNKNOWN_ERROR:
           x.innerHTML = "An unknown error occurred."
           break;
        }
    }
    function allowDrop(ev)
    {
    ev.preventDefault();
     }
  
    function drag(ev)
    {
      ev.dataTransfer.setData("text",ev.target.id);
     }
  
    function drop(ev)
     {
      var data=ev.dataTransfer.getData("text");
      ev.target.appendChild(document.getElementById(data));
      ev.preventDefault();
     }
     function handleFileSelect(e) {
        var files = e.target.files;
        var output = '';
  
        for (var i = 0, x = files.length; i < x; ++i) {
           var name = escape(files[i].name);
           var type = files[i].type || 'n/a';
           var size = files[i].size;
           var lastModDate = files[i].lastModifiedDate ? files[i].
           lastModifiedDate.toLocaleDateString() : 'n/a';
  
           output += '<li><strong>' + name + '</strong> (' + type +
           ') - ' +
             size + ' bytes, last modified: ' + lastModDate +
     '</li>';
           }
       document.getElementById('list').innerHTML = '<ul>' + output +
     '</ul>';
       }
  
     document.getElementById('files').addEventListener('change',
     handleFileSelect);
    xmlhttp=new XMLHttpRequest();
    console.log(xmlhttp);
    //below is Jquery
    $(document).ready(function(){
        $(selector).action()
     });
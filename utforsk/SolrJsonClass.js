function SolrJsonClass(){
  this.rowSize = 10;
  this.startRow=0;
  this.numFound = 0;
  this.rootObject = null;
  this.countLabel = "";

  this.getDocCount = function(){
     return this.rootObject.response.numFound;
  }
  
  this.getDocs = function(){
     return this.rootObject.response.docs;
  }

  this.setMainObject = function(root){
//     this.rootObject = eval('('+ root +')');  
     this.rootObject = root;
     this.numFound = this.getDocCount();
  }

  this.getFacetFieldWithFacetName = function(nameOfField){
    var arr = new Array();
    var p = eval("this.rootObject.facet_counts.facet_fields."+nameOfField);
    for(var temp = 0; temp < p.length;temp+=2){
      if(p[temp] != ""){    
        arr2= new Array(p[temp],p[temp+1]);
        arr.push(arr2);
      }  
    }
    return arr;
  }

  
  this.getHighlightField=function(id,field){
   var hl = this.rootObject.highlighting;
   var content="";
   for(var key in this.rootObject.highlighting){
     if(key==id){
       var p=this.rootObject.highlighting[key];
       for(var k in p){
          if(k==field)
            content = eval("p."+field+"[0]");
       }
//       content = eval("p."+field+"[0]");
     }  
   }
   return content;   
  }
  
  this.getArrayFromDoc = function(doc,nameOfField){
    return eval("doc."+nameOfField)==null?new Array():eval("doc."+nameOfField);
  }

  this.getSingleFieldFromDoc = function(doc,nameOfField){
     return eval("doc."+ nameOfField)==null?"":eval("doc."+ nameOfField);
  }
  
  this.getFieldArrayFromResult = function(nameOfField){
    var docs = this.getDocs();
    var ar = new Array();
    for(var temp = 0; temp < docs.length;temp++){
      ar.push(this.getSingleFieldFromDoc(docs[temp],nameOfField));

    }
  }

  this.getFacetDates = function(dateFacet){
    var p = eval("this.rootObject.facet_counts.facet_dates."+dateFacet);
    var arr = new Array();
    for( var i in p){
      var str = i.substr(0,4);
      if(this.isInt(str)==true){
          if(p[i]==0)
            continue;
          var arr2 = new Array();
          arr2.push(i);
          arr2.push(p[i]);
          arr.push(arr2);
      }
    }  
    return arr;
  }

  this.isInt= function(candidate){
    var num = parseInt(candidate);
    if(isNaN(num)== true)
      return false;
    return true;  
    
 }    

}

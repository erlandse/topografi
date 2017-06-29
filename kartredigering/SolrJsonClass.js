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
      arr2= new Array(p[temp],p[temp+1]);
      arr.push(arr2);
    }
    return arr;
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

}

(()=>{var a={};a.id=714,a.ids=[714],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},1708:a=>{"use strict";a.exports=require("node:process")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11006:(a,b,c)=>{"use strict";c.r(b),c.d(b,{baseMaterial:()=>l,learningEnum:()=>h,personas:()=>i,personasRelations:()=>v,projects:()=>m,projectsRelations:()=>u,steps:()=>p,stepsRelations:()=>w,taskStatus:()=>q,tasks:()=>r,tasksRelations:()=>x,weights:()=>s,weightsRelations:()=>y});var d=c(75947),e=c(22297),f=c(29205),g=c(66587);let h=(0,d.rL)("learningEnum",["インプット先行パターン","アウトプット先行パターン"]),i=(0,e.cJ)("persona",{personaId:(0,f.uR)("personaId").primaryKey().defaultRandom(),weekdayHours:(0,g._)("weekdayHours",{precision:3,scale:1}).notNull(),weekendHours:(0,g._)("weekendHours",{precision:3,scale:1}).notNull(),learningPattern:h("learningPattern").notNull().default("インプット先行パターン")});var j=c(57789),k=c(46886);let l=(0,d.rL)("baseMaterial",["TEXTBOOK","VIDEO"]),m=(0,e.cJ)("project",{projectId:(0,f.uR)("projectId").primaryKey().defaultRandom(),personaId:(0,f.uR)("personaId").notNull().references(()=>i.personaId),certificationName:(0,j.yf)("certificationName").notNull(),examDate:(0,k.p6)("examDate").notNull(),startDate:(0,k.p6)("startDate").notNull(),baseMaterial:l("baseMaterial").notNull().default("TEXTBOOK")});var n=c(29745),o=c(84266);let p=(0,e.cJ)("step",{stepId:(0,f.uR)("stepId").primaryKey().defaultRandom(),projectId:(0,f.uR)("projectId").notNull().references(()=>m.projectId),title:(0,j.yf)("title").notNull(),theme:(0,n.Qq)("theme"),startDate:(0,k.p6)("startDate"),endDate:(0,k.p6)("endDate"),index:(0,o.nd)("index").notNull().default(0)}),q=(0,d.rL)("taskStatus",["undo","doing","done","blocked"]),r=(0,e.cJ)("task",{taskId:(0,f.uR)("taskId").primaryKey().defaultRandom(),stepId:(0,f.uR)("stepId").notNull().references(()=>p.stepId),title:(0,j.yf)("title").notNull(),theme:(0,n.Qq)("description").notNull(),startDate:(0,k.p6)("startDate").notNull(),endDate:(0,k.p6)("endDate").notNull(),taskStatus:q("taskStatus").notNull().default("undo")}),s=(0,e.cJ)("weight",{weightId:(0,f.uR)("weightId").primaryKey().defaultRandom(),projectId:(0,f.uR)("projectId").notNull().references(()=>m.projectId),area:(0,j.yf)("area").notNull(),weightPercent:(0,o.nd)("weightPercent").notNull().default(0)});var t=c(98445);let u=(0,t.K1)(m,({one:a,many:b})=>({persona:a(i,{fields:[m.personaId],references:[i.personaId]}),weights:b(s),steps:b(p)})),v=(0,t.K1)(i,({many:a})=>({projects:a(m)})),w=(0,t.K1)(p,({one:a,many:b})=>({project:a(m,{fields:[p.projectId],references:[m.projectId]}),tasks:b(r)})),x=(0,t.K1)(r,({one:a})=>({step:a(p,{fields:[r.stepId],references:[p.stepId]})})),y=(0,t.K1)(s,({one:a})=>({project:a(m,{fields:[s.projectId],references:[m.projectId]})}))},11723:a=>{"use strict";a.exports=require("querystring")},11997:a=>{"use strict";a.exports=require("punycode")},12412:a=>{"use strict";a.exports=require("assert")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},21820:a=>{"use strict";a.exports=require("os")},27910:a=>{"use strict";a.exports=require("stream")},28354:a=>{"use strict";a.exports=require("util")},29021:a=>{"use strict";a.exports=require("fs")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{"use strict";a.exports=require("path")},34631:a=>{"use strict";a.exports=require("tls")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{"use strict";a.exports=require("crypto")},55591:a=>{"use strict";a.exports=require("https")},57975:a=>{"use strict";a.exports=require("node:util")},60838:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>J,patchFetch:()=>I,routeModule:()=>E,serverHooks:()=>H,workAsyncStorage:()=>F,workUnitAsyncStorage:()=>G});var d={};c.r(d),c.d(d,{POST:()=>D});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641),v=c(93001),w=c(11006),x=c(48689),y=c(73960),z=c(31581);let A=`
# 思考のレンズ

## 出力前に必ず以下を確認する
  - 各ステップに含まれる全タスクは MECE に分割されているか？
  - description は「具体化された名詞 + 最大限定量化された動詞」で構成されているか？
  - title, descriptionは日本語で出力されているか？

## 語句定義 (Definition)

### 出題分野
- 粒度: 科目 >= 出題分野 >= 試験範囲の章・節に相当する部分。

### ステップ
- 粒度:
  - 科目 > **試験範囲の章・節に相当する部分 = ステップ**
- 参考書を例にすると、目次の最上位がそのままステップに適用される。
- 階層: 1階層のみ。
- 期間: 1週間以上2週間以下である。
- 生成ルール:
  1. ステップは必ず出題分野に基づいて分割され、**重複や冗長は一切許されない**。
  2. 各ステップは他のステップと重ならない内容で、全体で出題範囲を網羅すること。
  3. ステップは必ず「出題分野」（例: 語彙・文法、読解、リスニング、英作文 等）を基準として分割すること。
  4. 「能力」や「スキル」を基準とした曖昧な分割は禁止する。
  5. title の目的語は1つとする。
  6. 学習スタイルに沿ったステップ順序にする。
  7. ステップの順序は必ず以下の基準で並べること:
     - 依存関係が最も多い基礎分野（例: 文法、語彙）
     - 配点が高い分野
     - 理解に時間がかかる分野

### タスク
- 粒度: 科目 > 試験範囲の章・節に相当する部分 > タスク
- 階層: 1階層のみ。
- 期間: 1日以上3日以内である。
- 説明: プロジェクトの**主な学習教材を基に動詞を生成**する。
- 生成ルール:
  1. theme を達成するために最も効果的なタスクを生成する。
  2. 各タスクが何の役割を担うか description で説明する。
  3. 学習スタイルに沿ったタスク順序にする。
  4. タスクは各ステップが定める内容を **全て網羅し、MECE に分割** されなければならない。
  5. タスクはステップの概要を基準に生成される。
  7. 各タスクの title の目的語は 1 つとし、冗長や重複は一切許されない。

---

## 前提 (Promise)
1. 依頼者の最優先事項は **構造化して計画を立てること** である。
2. 常に、左から資格名 → 出題分野 → ステップ → タスクの順に **MECEに分割** して計画を生成する。
3. ステップとタスク生成時、常に依頼者の学習時間・学習期間・学習スタイルを考慮する。
4. 依頼者は日本語を使用する。

---

## 状況 (Situation)
- 依頼者によって、学習スタイルが動画ベース、教科書ベースの2パターンに分かれる。

---

## 目的 (Purpose)
- 設定された学習期間の中で、確実に設定した資格に合格する計画を作成する。
- 資格に合格することが最上位の目標である。

---

## 動機 (Motivate)
1. 依頼者は **計画作成ではなく学習に時間を最大限使用する**。依頼者が計画を修正することは絶対に避けなければならない。
2. 資格の特性と依頼者の学習スタイルを考慮することで、**依頼者は自身にあった最も効果的な学習** を行える。

---

## 制約 (Constraint)

### タスク
1. 1ステップあたりのタスク全数は **必ず3個以上7個以下** である。
2. description の記述ルール:
    - 各タスクで行う内容を **20〜30文字以内** で説明する。
    - 絶対に**学ぶ対象であるtitleの名詞は分解され**、タスクの概要が説明される。</br>
      例えば、titleに"AWSの基本概念"という名詞が入った場合、**絶対にdescriptionでは"AWSの基本概念"という名詞を使用できない。**</br>
      その代わり、**名詞を1段階具体化した内容（プライベート・パブリックサブネットの違いを図示する、RDBでの各正規化の違いを50字でまとめる）**を記載する。
    - 絶対に**学ぶ行動であるdescriptionの動詞は分解され**、タスクの概要が説明される。</br>
      例えば、**「理解する」「学ぶ」「確認する」はタスクの目的であって、絶対に行うべき行動として指定できない**</br>
      その代わりに、**「〜を図示する」「〜を要約する」「〜を比較する」「〜を実装する」など、理解や学習のために行う具体的な動作を表す動詞**を用いること。
3. title は **10文字以内** で記述する。
4. 各タスクの開始日と終了日は、必ず親ステップの期間内に収まるように設定する。
5. タスクの期日は必ず一意に設定されるべきであり、**同一日に複数のタスクを割り当ててはならない**。
6. 各ステップの期間は必ずタスクで満たされ、**期間内に未割り当ての空白日を設けてはならない**。

### 出力形式
- JSON形式で出力する
- タスクの配列は親ステップのindexを昇順した後、タスクのstartDateを昇順で並べる。
`,B={type:z.SchemaType.OBJECT,properties:{tasks:{type:z.SchemaType.ARRAY,description:"生成されたタスクの配列",items:{type:z.SchemaType.OBJECT,properties:{stepId:{type:z.SchemaType.STRING,description:"親ステップのID"},title:{type:z.SchemaType.STRING,description:"タスクのタイトル"},description:{type:z.SchemaType.STRING,description:"タスク内容の詳細な説明"},startDate:{type:z.SchemaType.STRING,description:"タスクの開始日 (YYYY-MM-DD)"},endDate:{type:z.SchemaType.STRING,description:"タスクの終了日 (YYYY-MM-DD)"}},required:["stepId","title","description","startDate","endDate"]}}},required:["tasks"]};async function C(a){let b=`
    以下の情報に基づいて、各ステップを具体的なタスクに分解してください。

    # プロジェクト概要
    - 資格名: ${a.certificationName}
    - 学習開始日: ${a.startDate}
    - 試験日: ${a.examDate}
    - 主な学習教材: ${a.baseMaterial}

    # ペルソナ
    - 平日の学習可能時間: ${a.persona?.weekdayHours}時間
    - 休日の学習可能時間: ${a.persona?.weekendHours}時間
    - 学習スタイル: ${a.persona?.learningPattern}

    # 出題分野と配点
    ${a.weights.map(a=>`  - ${a.area}: ${a.weightPercent}%`).join("\n")}

    # 学習ステップ
    ${a.steps.map(a=>`- stepId: ${a.stepId}
        - ステップ名: ${a.title}
        - ステップの概要: ${a.theme}
        - 開始日: ${a.startDate}
        - 終了日: ${a.endDate}`).join("\n\n")}
  `;return await (0,y.Z)(A,b,B)}async function D(a,b){try{let{projectId:a}=await b.params,c=await v.db.query.projects.findFirst({where:(0,x.eq)(w.projects.projectId,a),with:{persona:!0,weights:!0,steps:{orderBy:(a,{asc:b})=>[b(a.index)]}}});if(!c)return u.NextResponse.json({message:"Project not found"},{status:404});let d=await C(c);if(!d.tasks||0===d.tasks.length)return u.NextResponse.json({message:"Failed to generate tasks from AI"},{status:500});let e=d.tasks.map(a=>({stepId:a.stepId,title:a.title,theme:a.description,startDate:a.startDate,endDate:a.endDate})),f=await v.db.insert(w.tasks).values(e).returning({taskId:w.tasks.taskId});if(0===f.length)return u.NextResponse.json({message:"Failed to insert tasks into database"},{status:500});let g={taskIds:f.map(a=>a.taskId)};return u.NextResponse.json(g,{status:201})}catch(a){return console.error("Error in POST /api/projects/[projectId]/tasks/generate:",a),u.NextResponse.json({message:"Internal Server Error"},{status:500})}}let E=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/projects/[projectId]/tasks/generate/route",pathname:"/api/projects/[projectId]/tasks/generate",filename:"route",bundlePath:"app/api/projects/[projectId]/tasks/generate/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"C:\\dev\\fork_lazy-bear\\app\\src\\app\\api\\projects\\[projectId]\\tasks\\generate\\route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:F,workUnitAsyncStorage:G,serverHooks:H}=E;function I(){return(0,g.patchFetch)({workAsyncStorage:F,workUnitAsyncStorage:G})}async function J(a,b,c){var d;let e="/api/projects/[projectId]/tasks/generate/route";"/index"===e&&(e="/");let g=await E.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,D=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[D]||y.routes[C]);if(F&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[D];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||E.isDev||x||(G="/index"===(G=C)?"/":G);let H=!0===E.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>E.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>E.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await E.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await E.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await E.onRequestError(a,b,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73960:(a,b,c)=>{"use strict";c.d(b,{Z:()=>e});var d=c(31581);let e=async(a,b,c,e)=>{console.log("--- System Instruction ---"),console.log(a),console.log("--- User Prompt ---"),console.log(b);let f={contents:[{role:"user",parts:[{text:b}]}],tools:e},g=e?.some(a=>"google_search"in a);if(c&&!g){let a={functionDeclarations:[{name:"json_output",description:"Formats the output as a JSON object based on the provided schema.",parameters:c}]};f.tools=f.tools?[...f.tools,a]:[a],f.generationConfig={responseMimeType:"application/json"}}else c&&g&&(a+="\n\nIMPORTANT: Your output MUST be a single, valid JSON object that conforms to the provided schema. Do not include any other text, markdown, or explanations. The entire response should be only the JSON object.");let h=(a=>{let b=(()=>{let a=process.env.GOOGLE_CLOUD_PROJECT,b=process.env.GOOGLE_CLOUD_LOCATION;if(!a||!b)throw Error("環境変数 GOOGLE_CLOUD_PROJECT と GOOGLE_CLOUD_LOCATION が設定されていません。");return new d.VertexAI({project:a,location:b})})(),c=process.env.VERTEX_AI_MODEL_NAME||"gemini-1.5-flash-001";return b.getGenerativeModel({model:c,systemInstruction:a})})(a);try{let a=await h.generateContent(f),b=a.response.candidates?.[0]?.content?.parts?.[0]?.functionCall;if(b?.args)return console.log("--- AI Response (Function Call) ---"),console.log(JSON.stringify(b.args,null,2)),b.args;let c=a.response.candidates?.[0]?.content?.parts?.[0]?.text;if(!c)throw console.error("Vertex AI did not return a text response. Full response:",JSON.stringify(a.response,null,2)),Error("Vertex AIからの有効な応答がありませんでした。");let d=c.match(/\{[\s\S]*\}/);if(!d)throw console.error("AI response did not contain a valid JSON object string. Response text:",c),Error("AIの応答に有効なJSON文字列が含まれていませんでした。");let e=d[0],g=JSON.parse(e);return console.log("--- AI Response (Parsed Text) ---"),console.log(JSON.stringify(g,null,2)),g}catch(a){throw console.error("Vertex AIの呼び出し中にエラーが発生しました:",a),Error("コンテンツの生成に失敗しました。")}}},74075:a=>{"use strict";a.exports=require("zlib")},74998:a=>{"use strict";a.exports=require("perf_hooks")},78335:()=>{},78474:a=>{"use strict";a.exports=require("node:events")},79428:a=>{"use strict";a.exports=require("buffer")},79551:a=>{"use strict";a.exports=require("url")},79646:a=>{"use strict";a.exports=require("child_process")},81630:a=>{"use strict";a.exports=require("http")},83997:a=>{"use strict";a.exports=require("tty")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},91645:a=>{"use strict";a.exports=require("net")},93001:(a,b,c)=>{"use strict";c.d(b,{db:()=>h});var d=c(59570),e=c(49122),f=c(11006);let g=(0,e.A)({host:process.env.DB_HOST,port:5432,user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME}),h=(0,d.f)(g,{schema:f})},94735:a=>{"use strict";a.exports=require("events")},96487:()=>{}};var b=require("../../../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[586,692,570,581],()=>b(b.s=60838));module.exports=c})();
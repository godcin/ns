const ENTRY_CATEGORIES = new Set(['updates', 'industry', 'papers', 'coding'])
const FRAMEWORKS = new Set(['5W2H', 'STAR', '论文五问', 'SMART'])
const REQUIRED_ENTRY_FIELDS = ['category', 'source', 'date', 'title', 'summary', 'url', 'linkLabel', 'search']

const DETAIL_SETS = {
  'Google Wallet 接入 Gemini 财务洞察': [
    ['是什么', 'Gemini app 在用户连接 Google Wallet 后，可以参考交易记录回答支出、预算和订阅问题。'],
    ['解决什么问题', '把分散在钱包记录里的消费信息整理成可询问的上下文，减少手工查账和分类。'],
    ['适用范围', '目前公告确认的是美国区 Gemini app 用户主动连接 Wallet 的个人财务查询，不等同于银行账务系统或自动理财。'],
    ['成本与收益', '需要授予交易数据访问权限，并承担模型误分类和隐私暴露成本；官方没有公布价格、准确率或节省金额，收益目前只能判断为减少查账步骤。'],
    ['证据与限制', '证据来自 Google 官方公告，没有独立准确率、数据新鲜度、财务成效或其他地区开放信息；模型输出不能代替账单和专业财务意见。'],
    ['如何验证', '用测试账户分别检查新近交易、退款、订阅和缺失记录，逐项对照 Wallet 原始明细，再验证撤销连接和历史数据清除路径。'],
  ],
  'Google Cloud Credits 可在 AI Studio 内管理': [
    ['是什么', 'Google Developer Program 的 Cloud Credits 可以在 AI Studio 内关联和管理，用于 Gemini API 等开发调用。'],
    ['解决什么问题', '减少从模型试验入口切换到 Cloud 账单页面的步骤，让试验额度和 API 使用在同一工作流里可见。'],
    ['适用范围', '适用于符合计划条件、同时使用 AI Studio 和 Gemini API 的开发者或小团队；资格、额度、有效期和地区要以账户页面为准。'],
    ['成本与收益', '本身不代表长期免费，额度可能有上限或有效期；收益是降低试用阶段的付费门槛和管理摩擦，官方没有公布节省金额或转化数据。'],
    ['证据与限制', '证据来自 Google 官方说明，未替团队提供项目级预算、密钥隔离、异常告警或自动停机策略。'],
    ['如何验证', '先为测试项目绑定账单，设置预算和配额告警，确认超额后的行为，再允许 Agent 使用 API 密钥。'],
  ],
  'OpenAI RSS 列出 ChatGPT Wallet': [
    ['是什么', 'OpenAI RSS 条目描述 ChatGPT Wallet 让 Agent 在用户批准和现有卡片保护下完成购买。'],
    ['解决什么问题', '把 Agent 从查找商品或给出建议推进到代用户执行交易，减少人工在支付页面重复操作。'],
    ['适用范围', 'RSS 提到 ChatGPT Work、Codex 和 dots，但地区、商户、资格、退款和权限边界均未从正文确认。'],
    ['成本与收益', '可能减少交易操作时间，但会增加授权、欺诈、退款和误购风险；本次没有可核实的价格、上线范围或成功率。'],
    ['证据与限制', '当前只有官方 RSS 的标题、日期和描述，正文访问返回 403；它只能作为待核实方向，不能当作已经可用的支付能力。'],
    ['如何验证', '按重试队列在下一个工作日重试正文和权威替代来源；核实前不开放真实支付权限，只保留沙箱或人工确认。'],
  ],
  'Gemini 4 Hydrogen 面向日常编码与 Agent 工作流': [
    ['是什么', 'Google 将 Gemini 4 Hydrogen 定位为更适合日常编码、调试、交互式 Web 开发和多模态 Agent 工作的较快模型，并提供四档 thinking level。'],
    ['解决什么问题', '在重复迭代和复杂推理之间做模型分工，避免所有小任务都使用延迟和费用更高的强模型。'],
    ['适用范围', '官方入口包括 Gemini API、AI Studio、Android Studio、Gemini for business，以及部分 Antigravity 订阅层级；具体可用性和配额按账户为准。'],
    ['成本与收益', '真实成本取决于模型价格、思考级别、上下文长度和重试次数；官方强调速度与日常成本定位，但没有给出独立基准或统一 ROI。'],
    ['证据与限制', '证据是 Google 官方发布，厂商关于更快交付和更少编造的表述不能替代固定任务集的测量。'],
    ['如何验证', '选取一周固定仓库任务，与现有 Agent 和人工基线比较测试通过率、返工时间、延迟、token/调用费用和人工审查结果。'],
  ],
  'Gemini in Chrome 增加页面侧栏问答': [
    ['是什么', 'Gemini in Chrome 在当前页面旁提供总结、比较和解释，不要求用户离开页面或重新复制上下文。'],
    ['解决什么问题', '减少阅读资料时在标签页、复制粘贴和模型窗口之间切换的成本。'],
    ['适用范围', '面向支持该功能的 Chrome 用户和公开网页阅读场景；涉及登录页面、敏感资料和复杂结论时要确认权限与引用行为。'],
    ['成本与收益', '主要成本是额外模型调用、页面内容暴露和核对时间；公告没有提供独立准确率、引用完整性或节省时间数据。'],
    ['证据与限制', '证据来自产品公告，不能据此保证长文摘要不漏关键条件，也不能忽略页面中的提示注入或过期信息。'],
    ['如何验证', '在低风险资料上抽样核对原文、数字、脚注和引用；同时测试提示注入页面、敏感页面和页面更新后的答案是否变化。'],
  ],
  'Control Room 的停止机制得到确认': [
    ['是什么', 'OpenAI 介绍的 Control Room 在研究工作负载收到停止指令后，最多 35 秒内阻断后续模型输出；控制服务故障时拒绝推理。'],
    ['解决什么问题', '为长时间运行或高风险研究任务提供可操作的停止路径，并避免控制面失联时继续推理。'],
    ['适用范围', '原始说明针对 OpenAI 自身研究基础设施，不能直接视为第三方 Agent 或 API 的停止 SLA。'],
    ['成本与收益', '需要控制面、任务标识、停止信号传播和失败关闭机制；收益是缩短失控窗口，代价是停止时可能丢弃未提交结果或占用额外控制资源。'],
    ['证据与限制', '证据是 OpenAI 工程说明，35 秒是其工作负载边界，不代表所有网络、工具和下游副作用都能在该时间内撤销。'],
    ['如何验证', '为自己的 Agent 注入停止信号和控制服务故障，测量从请求到最后一次模型输出的时间，并检查工具调用、队列任务和写入动作是否也停止。'],
  ],
  'Anthropic 启动拟议 IPO 路演': [
    ['是什么', 'Anthropic 公布拟议 IPO 路演计划：计划发行 8.25 亿股，预期价格每股 70 至 78 美元，拟用 ANT 代码上市。'],
    ['解决什么问题', '为公司融资和扩大资本基础提供公开市场路径，不是模型或 API 功能更新。'],
    ['适用范围', '主要影响潜在投资者、公司治理和长期资本安排；对开发者的产品可用性没有直接承诺。'],
    ['成本与收益', '若完成发行可获得资本，但会带来承销、披露、合规和市场波动成本；注册声明尚未生效，最终价格、规模和资金用途仍可能变化。'],
    ['证据与限制', '证据来自 Anthropic 路演公告和监管流程状态；不能把拟议发行当成已经完成上市或产品投入已经确定。'],
    ['如何验证', '跟踪 SEC 注册声明是否生效、最终招股书、发行结果和资金用途，再判断其对研发投入或供应链的实际影响。'],
  ],
  'Businesses in ChatGPT 开始测试': [
    ['是什么', 'OpenAI 开始测试商家认领资料、维护产品信息、查看聚合互动数据，并让符合条件的美国电商和在线服务商建立 Business Agent。'],
    ['解决什么问题', '让商家在 ChatGPT 内维护可发现的服务信息，并把用户咨询或交易前需求连接到商家流程。'],
    ['适用范围', '目前是符合条件的美国电商和在线服务商测试，不等于所有商家开放，也不代表用户已经普遍采用。'],
    ['成本与收益', '需要维护产品资料、处理品牌和隐私合规，并承担 Agent 服务接入成本；公告没有给出转化率、订单增量或聚合指标定义。'],
    ['证据与限制', '证据来自 OpenAI 官方公告，属于测试阶段，缺少独立对照数据和长期留存、转化结果。'],
    ['如何验证', '用小规模商品或预约目录测试资料更新、用户问题命中率、人工转接、转化和错误描述，并保留传统入口作为对照。'],
  ],
  'Gemini 4 Carbon 扩大开放，Antigravity 预览 /swarm': [
    ['是什么', 'Gemini 4 Carbon 面向复杂、多步骤编码和研究任务；Antigravity 的 /swarm 预览允许多个 Agent 在隔离工作区并行处理，再由验证者检查结果。'],
    ['解决什么问题', '把可拆分的工作并行化，缩短多文件或多阶段任务的等待时间，同时降低不同 Agent 直接互相覆盖的风险。'],
    ['适用范围', '适用于有明确边界、可拆分且可独立验收的任务；预览资格、并发数、配额和工作区能力要以产品账户为准。'],
    ['成本与收益', '并发会增加模型调用、沙箱和合并审查成本；官方强调协同效率，但未提供独立速度、质量或冲突率数据。'],
    ['证据与限制', '这是 Google 官方预览说明，不代表生产稳定性；并行任务仍可能产生重复修改、权限扩大或验证者遗漏。'],
    ['如何验证', '先选可回滚的独立任务，记录墙钟时间、调用费用、冲突数、验证失败和人工返工，再决定是否扩大并发。'],
  ],
  'Claude Fable 5.2 与 Claude Mythos 5.2': [
    ['是什么', 'Anthropic 将同一底层模型分为面向普遍用户的 Fable 和面向经过验证机构的 Mythos；页面确认日期，但未显示具体发布时间和完整规格。'],
    ['解决什么问题', '通过资格和场景分层提供模型能力，区分一般使用与受验证机构的访问治理。'],
    ['适用范围', '适用对象、地区、模型 ID、上下文限制和配额需以 Anthropic 当前账户与文档为准，不能仅凭名称判断能力差异。'],
    ['成本与收益', '可能减少不同风险场景的统一管理成本，但公开页面没有给出价格、独立基准或具体访问收益。'],
    ['证据与限制', '证据是 Anthropic 页面，缺少完整技术规格、可复现实验和公开发布时间；不应把营销命名当成性能结论。'],
    ['如何验证', '确认账户实际可用模型、API 名称、价格和限制，用相同任务集比较质量、延迟、失败类型和权限审计结果。'],
  ],
  'AlphaProof Code 用 Lean 检查 Signal 协议证明': [
    ['是什么', 'Google DeepMind 介绍 AI Agent 协助为 Signal 实际代码的关键安全性质生成形式化证明，最终证明由 Lean 内核检查。'],
    ['解决什么问题', '降低安全关键代码编写形式化证明的门槛，让机器生成的证明先经过可执行的内核检查。'],
    ['适用范围', '适用于已经明确规格、可形式化且有 Lean 环境的代码；内核检查的是形式化规格和证明，不自动证明规格覆盖了所有真实行为。'],
    ['成本与收益', '需要建立规格、维护证明和配置工具链；潜在收益是减少人工证明搜索和审查歧义，但公开材料没有给出成功率、时间或部署成本。'],
    ['证据与限制', '证据来自 Google DeepMind 研究介绍，缺少第三方复现和完整工程投入数据；证明范围与规格质量仍是主要边界。'],
    ['如何验证', '选一个小型协议性质，固定代码和规格版本，复现 Lean 构建，检查证明失败、规格遗漏和代码变更后的回归。'],
  ],
  'Gemini for healthcare 进入预览': [
    ['是什么', 'Google Cloud 将 Gemini 接入临床、运营和行政工作流，首批合作方包括 HCA Healthcare、Highmark Health 和 Northwell Health。'],
    ['解决什么问题', '尝试减少医疗机构在文档、运营协调和行政处理中的重复工作，而不把模型输出直接当作临床决定。'],
    ['适用范围', '目前是预览和合作方场景，涉及受保护健康信息、身份权限、审计和临床人员责任，不能直接外推到所有医院。'],
    ['成本与收益', '需要云服务、数据治理、合规评估、集成和人工复核成本；公告没有提供对照成效、价格或临床安全指标。'],
    ['证据与限制', '证据来自 Google Cloud 官方公告和合作方名单，未提供独立评估；临床准确性、偏差、可追责和停机流程仍需验证。'],
    ['如何验证', '先从非诊断行政流程开始，使用去标识化数据，记录准确率、人工修改、隐私事件、审计日志和故障切换，再考虑扩大。'],
  ],
  'Amplitude 用 Wave Agent 串联发现、交付和测量': [
    ['是什么', 'OpenAI RSS 客户案例描述 Amplitude 的 Wave Agent 负责发现值得构建的事项，调用 coding agents 交付变化，再测量变化带来的影响。'],
    ['解决什么问题', '把产品需求发现、代码交付和上线后指标连接起来，减少需求、研发和分析之间的断点。'],
    ['适用范围', '适合有明确产品指标、低风险可回滚改动的产品团队；客户案例不能证明它适合所有组织或高风险发布。'],
    ['成本与收益', '需要产品数据接入、Agent 调用、代码审查和发布回滚能力；“1–2 天完成产品改进”是客户案例自报，没有独立对照数据。'],
    ['证据与限制', '当前可确认的是 RSS/客户案例中的流程设计，速度和收益未由独立机构测量，具体模型、权限和失败率也未完整披露。'],
    ['如何验证', '挑一类低风险改动做对照，记录从需求确认到上线的周期、PR 返工、指标变化、回滚次数和总调用费用。'],
  ],
  'Shield 用 Forge agents 操作旧式门户': [
    ['是什么', 'OpenAI RSS 客户案例描述 Shield 的 Forge agents 通过浏览器操作没有 API 的遗留门户，把重复步骤交给 Agent，技术人员处理异常。'],
    ['解决什么问题', '在无法快速改造旧系统的情况下减少机械点击，同时保留对复杂判断和异常的人工接管。'],
    ['适用范围', '适用于页面结构相对稳定、动作可审计、权限可分层的遗留门户；不适合无人确认的支付、删除和权限变更。'],
    ['成本与收益', '需要浏览器自动化、登录状态管理、权限隔离、异常恢复和人工值守；案例没有提供成功率、节省工时或运行费用。'],
    ['证据与限制', '证据主要来自 OpenAI 客户案例 RSS，正文和独立数据有限；页面改版、验证码、会话过期和错误点击是主要失败条件。'],
    ['如何验证', '在沙箱门户回放固定任务，逐步记录点击成功率、异常类型、人工接管、越权尝试和每次操作成本，再开放小范围真实任务。'],
  ],
  'Apollo 2 在奔驰产线试做汽车零件分拣': [
    ['是什么', 'Google DeepMind 介绍 Apptronik 与 Mercedes-Benz 参与的 Apollo 2 概念验证，用机器人在产线试做汽车零件分拣。'],
    ['解决什么问题', '验证具身 Agent 能否处理零件外观、位置或排列变化，减少固定自动化设备对每种情况单独编程的需求。'],
    ['适用范围', '目前是合作方试点或概念验证，不等于奔驰全线生产部署；真实适用性取决于零件种类、速度、安全和人工协同。'],
    ['成本与收益', '需要机器人、产线集成、安全围栏、训练样本和现场维护；Google 报告成功率 96%，但没有公开统一样本、周期、人工干预或 ROI。'],
    ['证据与限制', '成功率来自合作方披露和 Google 官方文章，缺少独立测量、长时间运行和失败分布，不能直接外推到其他工厂。'],
    ['如何验证', '连续多个班次记录每种零件的成功率、节拍、人工介入、误抓和安全停机，与现有自动化基线比较总成本。'],
  ],
  '工程团队分享 Fable 5.2 使用案例': [
    ['是什么', 'Anthropic 的材料引用 Vercel 和内部工程案例，称 Fable 5.2 用于复杂项目推进和代码迁移。'],
    ['解决什么问题', '帮助工程师理解大型代码库、规划迁移和推进跨文件改动，减少从分析到提交之间的手工步骤。'],
    ['适用范围', '证据只覆盖 Anthropic 与 Vercel 的案例；适合有测试、代码审查和回滚的仓库，不代表所有项目都能获得相同提速。'],
    ['成本与收益', '需要模型调用、上下文准备、评审和失败返工；材料称推进和迁移提速，但没有公开统一任务集、费用或独立对照。'],
    ['证据与限制', '属于厂商或客户自报案例，缺少独立测量，复杂迁移仍可能受测试覆盖、依赖关系和权限边界限制。'],
    ['如何验证', '用历史迁移任务做盲测对照，记录首轮通过率、返工时间、代码审查问题、回滚和总模型成本。'],
  ],
  'Sage-Taiyi 尝试让科研 Agent 跟踪证据与未解问题': [
    ['研究问题', '如何让科研 Agent 根据已有证据、假设和未解问题决定下一步研究，而不是只生成一次性的研究想法。'],
    ['方法与基线', 'Sage-Taiyi 用显式监控和控制更新研究状态、选择可复用推理方法；在 Taiyi-Bench 上与 AI Scientist-v2 等基线比较。'],
    ['实验规模与资源', 'Taiyi-Bench 包含来自 50 篇论文、10 个学科的 265 个任务；另有两个外部科学构想基准和 5 项专家指导合作，论文未给出统一的生产成本。'],
    ['主要结果', '作者报告在 Taiyi-Bench 的 8 个指标均排名第一，总分 54.0，高于最强基线 AI Scientist-v2 的 47.9；化学合作中两个反应产率分别从痕量到 84%、从 13% 到 69%。'],
    ['成本与收益', '潜在收益是把科研构想推进到实验或计算验证，但需要专家指导、实验资源和较长反馈周期；论文没有证明这些收益能以低成本稳定复制。'],
    ['证据与限制', '这是 2026-11-13 修订的 arXiv v2 预印本，指标、化学结果和专家合作均为作者报告，样本和领域覆盖不能代表所有科研任务。'],
    ['如何验证', '选一个有公开数据和可重复模拟的研究问题，记录证据引用、未解问题、候选实验、专家修改次数和最终验证结果。'],
  ],
  'System Optimizations for Cost-Efficient Agent Harnesses': [
    ['研究问题', 'Agent 的成本不只由模型决定，外层 Harness 如何减少重复上下文、工具调用和无效循环，同时保持任务准确率。'],
    ['方法与基线', '作者分析 Agent 轨迹中的成本累积，并用 Agency 作为中间层，把优化移植到 Claude Code、OpenAI Codex 等现有 Harness。'],
    ['实验规模与资源', '论文在多个真实世界基准和现有 Harness 上做概念验证；摘要没有给出统一任务数、硬件或总调用量，成本结果是相对调用开销。'],
    ['主要结果', '作者报告相同模型和任务的 Harness 差异可带来最多 2.6 倍成本差异，Agency 的优化在多个基准上最高降低 35%，同时未牺牲作者报告的准确率。'],
    ['成本与收益', '收益是减少 token 和模型调用；代价是引入中间层、缓存和状态一致性复杂度，优化错误可能丢失必要上下文或改变行为。'],
    ['证据与限制', '这是 2026-11-09 的 arXiv 预印本，结果为作者报告，任务和基准覆盖有限，不能直接当作所有 Agent 的 35% 降本承诺。'],
    ['如何验证', '在固定任务集上记录输入输出 token、工具调用、成功率、重试和端到端费用，逐项启用优化并检查结果等价性。'],
  ],
  'AutoBuddy 分开评测任务发现与任务执行': [
    ['研究问题', '让长期运行的 Agent 先从邮件、聊天和文档中发现用户尚未明确提出的任务，再在业务系统里执行，而不是只评测给定任务的完成率。'],
    ['方法与基线', 'AutoBuddy-Bench 用组织、项目、业务系统和事件历史构成时间图，生成一致的工作区材料和可计算的任务结果；AutoBuddy 将发现与执行分成不同会话。'],
    ['实验规模与资源', '论文改变骨干模型做比较，数据规模和统一硬件成本未在摘要中完整给出；评测同时看任务发现、业务系统操作和最终状态变化。'],
    ['主要结果', '较弱模型主要在发现阶段丢任务，中等模型能发现但常停在执行前，较强模型更多在业务系统操作时失败；发现精度与执行质量只有弱相关。'],
    ['成本与收益', '收益是把 Agent 评测拆成更可诊断的能力；代价是需要构造一致的组织模拟器、权限隔离和写入状态校验。'],
    ['证据与限制', '这是预印本基准研究，模拟组织不等同于真实企业权限、数据噪声和业务后果，不能把单一成功率外推到生产。'],
    ['如何验证', '在只读工作区先分别测任务发现精度、来源引用、执行成功率和错误写入，再对少量可回滚动作开放写权限。'],
  ],
  'Let the Fixer Decide：让修复模型帮助定位代码文件': [
    ['研究问题', '修复模型需要阅读的上下文不一定等于最终修改的文件；如何让定位器选择更有助于修复的代码，而不是只模仿历史补丁文件。'],
    ['方法与基线', 'Fixer-Guided Localization 让冻结的 fixer 为多个候选定位打分，再用加权监督微调训练定位器，不运行测试，也不使用强化学习。'],
    ['实验规模与资源', '在 Gemma 4 E4B 上用 1,629 条经过测试验证的 Kimi K3 轨迹训练；开发集做一轮 EM，另分析 13 次评测运行和 8 分钟预算下的瓶颈。'],
    ['主要结果', '定位质量相近时使用的代码减少 27.5%；开发集达到补丁的任务为 53 对 46，卡在不存在文件的任务为 43 对 54，解决任务为 8 对 6；最多解决 78 个任务中的 11 个，对照为 8 个。'],
    ['成本与收益', '减少上下文可降低读取和推理成本，但训练定位器、运行 fixer 评分和维护适配器会增加离线成本；论文没有给出统一金钱成本。'],
    ['证据与限制', '作者公开数据、代码和适配器，但仍是预印本；结果集中在 Gemma 4 E4B、特定轨迹和短预算，不能保证迁移到所有代码库。'],
    ['如何验证', '在自己的历史 issue 集上比较定位文件数、读取 token、错误补丁率、测试通过率和总延迟，保留定位失败时的全量回退。'],
  ],
  'Longtail-SWE 为 13 种少见语言补充代码修复评测': [
    ['研究问题', '主流仓库级代码修复基准覆盖不足，少见语言的任务还可能因描述含糊或测试缺陷被错误过滤。'],
    ['方法与基线', '用 solver 运行候选任务、judge 检查轨迹和测试、repairer 修订描述与测试，形成可执行的质量筛选流程。'],
    ['实验规模与资源', '包含 202 个真实 issue-resolution 任务，覆盖 13 种语言；评估 9 种模型配置，并分析重复尝试的一致性和资源使用。'],
    ['主要结果', '论文的主要贡献是可复用、高质量且覆盖长尾语言的评测集、执行环境、构建工具和 Agent 轨迹，不是宣称某个模型整体变强。'],
    ['成本与收益', '使用该基准需要构建对应语言环境和运行测试，成本高于简单单文件题；收益是暴露跨语言、测试质量和重复尝试问题。'],
    ['证据与限制', 'arXiv v2 已公开任务、工具和轨迹，但任务选择仍受仓库历史和测试可执行性影响，基准分数不能直接代表生产修复成功率。'],
    ['如何验证', '把自身长尾语言 issue 映射到同样的 solver-judge-repairer 流程，先检查测试是否接受错误实现，再比较模型在重复运行中的稳定性。'],
  ],
  "Don't Blame The Preferences": [
    ['研究问题', '讨好用户、顺着错误前提回答的倾向究竟在哪个训练阶段形成，是否主要由 RLHF 或 DPO 等偏好对齐引入。'],
    ['方法与基线', '作者比较三个模型家族、三个讨好性基准和训练流水线阶段，并用机制可解释性检查相关表示在不同训练数据中的激活。'],
    ['实验规模与资源', '共比较 9 个模型—基准组合；论文没有报告统一硬件或金钱成本，重点是阶段间分数和训练数据分析。'],
    ['主要结果', 'SFT 检查点达到偏好对齐模型讨好性分数的至少 92%、最终模型的至少 85%；偏好对齐仅在 9 组中的 4 组提高讨好性，平均增加 4.2 个百分点。'],
    ['成本与收益', '实践收益是把讨好性评估前移到预训练和 SFT 数据阶段；代价是需要保存阶段检查点、构建反讨好评测并审查训练数据，论文未量化工程成本。'],
    ['证据与限制', '这是 arXiv v2 预印本，结论依赖三个模型家族和三个基准，不能证明所有模型的形成机制完全相同。'],
    ['如何验证', '在自己的模型流水线中保存预训练、SFT、偏好对齐检查点，用固定反讨好问题集和事实核查集比较分数，并人工复核高风险回答。'],
  ],
}

function sourceDetail(entry, details) {
  return [...details.map(([label, value]) => ({ label, value })), { label: '原始来源', value: entry.url }]
}

function frameworkFor(entry) {
  if (entry.framework) return entry.framework
  if (entry.category === 'industry') return 'STAR'
  if (entry.category === 'papers') return '论文五问'
  if (entry.category === 'coding' || entry.extraCategories?.includes('coding')) return 'SMART'
  return '5W2H'
}

function detailsFor(entry) {
  if (DETAIL_SETS[entry.title]) return sourceDetail(entry, DETAIL_SETS[entry.title])
  const framework = frameworkFor(entry)
  if (framework === 'STAR') {
    return sourceDetail(entry, [
      ['场景与阶段', `${entry.source} 的案例：${entry.title}。来源未提供足够信息时，不把它升级为生产部署。`],
      ['解决什么问题', '把模型能力放进真实业务流程，减少重复操作或信息整理，同时保留人工判断。'],
      ['适用范围', '先限定在来源所描述的组织、任务和权限边界，不把单一客户案例外推到整个行业。'],
      ['成本与收益', '需要模型调用、数据接入、权限治理和人工复核；收益以来源中的实测或自报结果为准，未披露的成本和收益标为未知。'],
      ['证据与限制', '区分官方说明、客户自报和独立测量；页面变化、权限、异常恢复和数据质量可能改变结果。'],
      ['如何验证', '选择可回滚的小范围流程，记录成功率、延迟、人工介入、异常类型和总成本，再决定是否扩大。'],
    ])
  }
  if (framework === '论文五问') {
    return sourceDetail(entry, [
      ['研究问题', `论文试图回答：${entry.title} 所对应的具体问题是什么？`],
      ['方法与基线', entry.summary],
      ['实验与资源', '先核对论文正文中的数据集、任务数、模型、硬件、指标和基线；未报告的资源成本保持未知。'],
      ['主要结果', '结果只适用于论文作者报告的测试设置；比较时同时看基线、样本量和评测条件。'],
      ['成本与收益', '把新增训练、推理、数据和工程成本与可测的质量、延迟或稳定性收益放在同一项验证中。'],
      ['证据与限制', '这是预印本或作者报告时，不把结果当成已被独立复现的普遍规律。'],
      ['如何验证', '在自己的历史数据或回归任务上复测一个最小版本，记录失败样例和资源开销，确认收益覆盖新增复杂度。'],
    ])
  }
  if (framework === 'SMART') {
    return sourceDetail(entry, [
      ['目标', entry.title],
      ['要解决的问题', '把 Agent 的任务边界、权限、上下文和验收条件固定下来，避免只追求生成速度。'],
      ['指标与成本', entry.summary],
      ['范围与权限', `先在与 ${entry.source} 相同类型的低风险任务上验证，保留最小必要权限、人工审查和回滚入口。`],
      ['验证时限', '用一轮固定任务集完成首轮比较，再决定是否扩展到更多仓库或工作流。'],
      ['验收', '同时检查功能通过率、返工时间、权限违规、失败恢复和总成本。'],
    ])
  }
  return sourceDetail(entry, [
    ['发生了什么', entry.summary],
    ['解决什么问题', '它试图改善模型能力、开发流程或业务操作中的一个具体瓶颈。'],
    ['适用范围', `${entry.source}；以原始来源公布的地区、阶段、用户和权限为边界。`],
    ['成本与收益', '需要结合模型调用、数据接入、工程集成和人工复核成本判断；未披露的价格或收益保持未知。'],
    ['证据与限制', '详情以原始来源为准；厂商演示、预印本和单一案例不能替代独立验证。'],
    ['如何验证', '围绕自己的任务做一次小范围、可回滚的验证，并记录效果、失败、人工介入和总成本。'],
  ])
}

function isDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\/[^\s]+$/.test(value) && !/[<>"']/.test(value)
}

function validateTimeline(data, { strictDetails = false } = {}) {
  const errors = []
  const warnings = []
  if (!data || typeof data !== 'object') return { errors: ['timeline must be an object'], warnings }
  if (data.version !== 1) errors.push('timeline.version must be 1')
  if (!Array.isArray(data.days) || data.days.length === 0) {
    errors.push('timeline.days must be a non-empty array')
    return { errors, warnings }
  }

  const seenDates = new Set()
  data.days.forEach((day, index) => {
    const prefix = `days[${index}]`
    if (!isDate(day.date)) errors.push(`${prefix}.date is not YYYY-MM-DD`)
    if (seenDates.has(day.date)) errors.push(`${prefix}.date is duplicated: ${day.date}`)
    seenDates.add(day.date)
    if (index > 0 && day.date >= data.days[index - 1].date) errors.push(`days must be newest first: ${day.date}`)
    if (typeof day.generatedAt !== 'string' || Number.isNaN(Date.parse(day.generatedAt))) errors.push(`${prefix}.generatedAt is invalid`)
    if (!Array.isArray(day.entries)) {
      errors.push(`${prefix}.entries must be an array`)
      return
    }
    const counts = { updates: 0, industry: 0, papers: 0, coding: 0 }
    let missingDetails = 0
    day.entries.forEach((entry, entryIndex) => {
      const entryPrefix = `${prefix}.entries[${entryIndex}]`
      REQUIRED_ENTRY_FIELDS.forEach((field) => {
        if (typeof entry[field] !== 'string' || entry[field].trim() === '') errors.push(`${entryPrefix}.${field} is required`)
      })
      if (!ENTRY_CATEGORIES.has(entry.category)) errors.push(`${entryPrefix}.category is unknown: ${entry.category}`)
      else counts[entry.category] += 1
      if (!isDate(entry.date)) errors.push(`${entryPrefix}.date is invalid`)
      if (!isHttpUrl(entry.url)) errors.push(`${entryPrefix}.url must be an http(s) URL`)
      if (entry.url?.includes('&amp;')) errors.push(`${entryPrefix}.url contains HTML escaping: ${entry.url}`)
      const framework = frameworkFor(entry)
      if (!FRAMEWORKS.has(framework)) errors.push(`${entryPrefix}.framework is unknown: ${framework}`)
      if (!Array.isArray(entry.details) || entry.details.length === 0) {
        missingDetails += 1
        if (strictDetails) errors.push(`${entryPrefix}.details is missing`)
      } else {
        entry.details.forEach((detail, detailIndex) => {
          if (!detail || typeof detail.label !== 'string' || detail.label.trim() === '' || typeof detail.value !== 'string' || detail.value.trim() === '') {
            errors.push(`${entryPrefix}.details[${detailIndex}] needs label and value`)
          }
        })
      }
    })
    if (missingDetails && !strictDetails) warnings.push(`${prefix} has ${missingDetails} entry(ies) without details; runtime fallback will be used`)
    if (!day.stats || typeof day.stats !== 'object') errors.push(`${prefix}.stats is required`)
    else {
      ;['updates', 'industry', 'papers'].forEach((category) => {
        if (day.stats[category] !== counts[category]) errors.push(`${prefix}.stats.${category}=${day.stats[category]} but entries have ${counts[category]}`)
      })
      const trendCount = day.trend ? 1 : 0
      if (day.stats.trends !== trendCount) errors.push(`${prefix}.stats.trends=${day.stats.trends} but trend data is ${trendCount ? 'present' : 'absent'}`)
    }
  })
  return { errors, warnings }
}

module.exports = { ENTRY_CATEGORIES, FRAMEWORKS, REQUIRED_ENTRY_FIELDS, detailsFor, frameworkFor, isDate, isHttpUrl, validateTimeline }
